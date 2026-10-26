import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';

const MEAL_PRICE_RUPEES = 25;

/** Constant-time comparison of two hex HMAC digests (avoids timing side channels). */
export function safeHexEqual(expectedHex: string, receivedHex: string | undefined): boolean {
  if (!receivedHex || receivedHex.length !== expectedHex.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expectedHex), Buffer.from(receivedHex));
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpayInstance: Razorpay | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret) {
      this.razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
      this.logger.log('Razorpay gateway initialized.');
    } else if (this.isProduction) {
      this.logger.error('RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET missing in production — payments are disabled.');
    } else {
      this.logger.warn('Razorpay keys missing. Payments running in local sandbox mode.');
    }
  }

  private get isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  async createOrder(dto: CreateOrderDto, userId?: string) {
    if (!this.razorpayInstance && this.isProduction) {
      throw new ServiceUnavailableException('Payments are not configured');
    }

    const amountInPaise = Math.round(dto.amount * 100);
    const currency = 'INR';
    // Meals are always derived server-side from the amount the donor actually pays.
    const meals = Math.max(1, Math.floor(dto.amount / MEAL_PRICE_RUPEES));
    let orderId = `order_dev_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    if (this.razorpayInstance) {
      try {
        const order = await this.razorpayInstance.orders.create({
          amount: amountInPaise,
          currency,
          receipt: `rcpt_${Date.now()}`,
          notes: { campaignId: dto.campaignId || '', mealsSponsored: String(meals), userId: userId || '' },
        });
        orderId = order.id;
      } catch (err: any) {
        this.logger.error(`Razorpay order creation error: ${err?.message || err}`);
        throw new BadRequestException('Failed to initialize payment gateway order');
      }
    }

    const payment = await this.prisma.payment.create({
      data: {
        userId: userId || null,
        campaignId: dto.campaignId || null,
        orderId,
        amount: amountInPaise,
        currency,
        status: 'created',
        mealsSponsored: meals,
        donorName: dto.donorName || 'Generous Donor',
        donorEmail: dto.donorEmail || null,
        metadata: { source: 'web_checkout' },
      },
    });

    return {
      orderId,
      amount: amountInPaise,
      currency,
      mealsSponsored: meals,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_goodwill',
      paymentId: payment.id,
    };
  }

  /**
   * Checkout callback from the browser. The browser is untrusted, so the
   * HMAC(order_id|payment_id, key_secret) signature must match before anything is credited.
   */
  async verifyPayment(dto: VerifyPaymentDto) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret) {
      const expected = crypto
        .createHmac('sha256', keySecret)
        .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
        .digest('hex');

      if (!safeHexEqual(expected, dto.razorpaySignature)) {
        await this.prisma.payment.updateMany({
          where: { orderId: dto.razorpayOrderId, status: 'created' },
          data: { status: 'failed' },
        });
        throw new BadRequestException('Invalid payment signature');
      }
    } else if (this.isProduction) {
      // Previously the signature check was silently skipped when the secret was missing,
      // so anyone could POST /payments/verify and mark an order as paid.
      throw new ServiceUnavailableException('Payments are not configured');
    }

    return this.markPaid(dto.razorpayOrderId, dto.razorpayPaymentId);
  }

  /**
   * Server-to-server confirmation from Razorpay. Source of truth if the donor closes the
   * tab before the checkout callback fires. Signature = HMAC(raw body, webhook secret).
   */
  async handleWebhook(rawBody: Buffer | undefined, signature: string | undefined) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) throw new ServiceUnavailableException('Webhook not configured');
    if (!rawBody) throw new BadRequestException('Missing body');

    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    if (!safeHexEqual(expected, signature)) throw new UnauthorizedException('Invalid webhook signature');

    const event = JSON.parse(rawBody.toString('utf8')) as {
      event: string;
      payload?: { payment?: { entity?: { id: string; order_id: string } } };
    };

    const entity = event.payload?.payment?.entity;
    if (event.event === 'payment.captured' && entity) {
      const result = await this.markPaid(entity.order_id, entity.id);
      return { received: true, alreadyProcessed: result.alreadyProcessed };
    }
    if (event.event === 'payment.failed' && entity) {
      await this.prisma.payment.updateMany({
        where: { orderId: entity.order_id, status: 'created' },
        data: { status: 'failed', paymentId: entity.id },
      });
    }
    return { received: true };
  }

  /**
   * Single place where an order becomes "paid". Idempotent: the browser callback and the
   * webhook can both arrive (or be replayed), but only the first `created → success`
   * transition wins and applies side effects. Before this, replaying /verify kept
   * incrementing campaign meals and impact records.
   */
  async markPaid(orderId: string, razorpayPaymentId: string) {
    const { count } = await this.prisma.payment.updateMany({
      where: { orderId, status: 'created' }, // compare-and-set on status
      data: { status: 'success', paymentId: razorpayPaymentId },
    });

    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: { campaign: true },
    });
    if (!payment) throw new NotFoundException('Payment order not found');

    if (count === 0) {
      if (payment.status !== 'success') throw new BadRequestException(`Payment is ${payment.status}`);
      return { success: true, alreadyProcessed: true, message: 'Payment already confirmed', payment };
    }

    if (payment.campaignId) {
      await this.prisma.$transaction([
        this.prisma.impactCampaign.update({
          where: { id: payment.campaignId },
          data: { currentAmount: { increment: payment.mealsSponsored } },
        }),
        this.prisma.impactRecord.create({
          data: {
            campaignId: payment.campaignId,
            userId: payment.userId,
            actionType: 'DIRECT_DONATION',
            impactValue: payment.mealsSponsored,
          },
        }),
      ]);
    }

    // XP only goes to the user who created the order (bound server-side at create time).
    if (payment.userId) {
      const xpBonus = Math.round(payment.amount / 100) * 2; // 2 XP per ₹1
      await this.prisma.user.update({
        where: { id: payment.userId },
        data: {
          contributionScore: { increment: xpBonus },
          reputationScore: { increment: Math.round(xpBonus / 2) },
        },
      });
    }

    if (payment.donorEmail) {
      this.mailService
        .sendDonationReceipt(payment.donorEmail, {
          donorName: payment.donorName || 'Generous Donor',
          amount: payment.amount,
          currency: payment.currency,
          mealsSponsored: payment.mealsSponsored,
          campaignName: payment.campaign?.name,
          paymentId: razorpayPaymentId,
          orderId,
        })
        .catch((err) => this.logger.warn(`Receipt email failed: ${err?.message}`));
    }

    return {
      success: true,
      alreadyProcessed: false,
      message: `Payment verified! ${payment.mealsSponsored} meals successfully funded.`,
      payment,
    };
  }

  async getRecentDonations(limit = 10) {
    return this.prisma.payment.findMany({
      where: { status: 'success' },
      take: Math.min(Math.max(limit, 1), 50),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        currency: true,
        mealsSponsored: true,
        donorName: true, // public feed: never expose donor emails
        createdAt: true,
        campaign: { select: { id: true, name: true, unit: true } },
        user: { select: { id: true, username: true } },
      },
    });
  }

  async getMyDonations(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId, status: 'success' },
      orderBy: { createdAt: 'desc' },
      include: { campaign: { select: { id: true, name: true, unit: true } } },
    });
  }
}
