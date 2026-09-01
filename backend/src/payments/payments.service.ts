import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpayInstance: any = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret) {
      try {
        this.razorpayInstance = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });
        this.logger.log('Razorpay gateway initialized successfully.');
      } catch (err: any) {
        this.logger.error(`Failed to initialize Razorpay SDK: ${err?.message}`);
      }
    } else {
      this.logger.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing. Payments service running in Sandbox/Dev mode.');
    }
  }

  async createOrder(dto: CreateOrderDto, userId?: string) {
    const amountInPaise = Math.round(dto.amount * 100);
    const currency = dto.currency || 'INR';
    const meals = dto.mealsSponsored || Math.max(1, Math.round(dto.amount / 25)); // ~Rs 25 per meal
    let orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (this.razorpayInstance) {
      try {
        const order = await this.razorpayInstance.orders.create({
          amount: amountInPaise,
          currency,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            campaignId: dto.campaignId || '',
            mealsSponsored: meals.toString(),
            userId: userId || '',
          },
        });
        orderId = order.id;
      } catch (err: any) {
        this.logger.error(`Razorpay order creation error: ${err?.message || err}`);
        throw new BadRequestException('Failed to initialize payment gateway order');
      }
    }

    // Save payment record in DB
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

  async verifyPayment(dto: VerifyPaymentDto, userId?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId: dto.razorpayOrderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment order not found');
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keySecret && this.razorpayInstance) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== dto.razorpaySignature) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'failed' },
        });
        throw new BadRequestException('Invalid payment signature verification');
      }
    }

    // Update payment as success
    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'success',
        paymentId: dto.razorpayPaymentId,
        donorName: dto.donorName || payment.donorName,
        donorEmail: dto.donorEmail || payment.donorEmail,
      },
      include: { campaign: true },
    });

    // Update campaign if linked
    if (payment.campaignId) {
      await this.prisma.impactCampaign.update({
        where: { id: payment.campaignId },
        data: {
          currentAmount: { increment: payment.mealsSponsored },
        },
      });

      // Create Impact Record
      await this.prisma.impactRecord.create({
        data: {
          campaignId: payment.campaignId,
          userId: userId || payment.userId || null,
          actionType: 'DIRECT_DONATION',
          impactValue: payment.mealsSponsored,
        },
      });
    }

    // Award bonus score to user if logged in
    const targetUserId = userId || payment.userId;
    if (targetUserId) {
      const xpBonus = Math.round(payment.amount / 100) * 2; // 2 XP per Rs 1
      await this.prisma.user.update({
        where: { id: targetUserId },
        data: {
          contributionScore: { increment: xpBonus },
          reputationScore: { increment: Math.round(xpBonus / 2) },
        },
      });
    }

    // Send receipt email if donor email is present
    const recipientEmail = dto.donorEmail || payment.donorEmail;
    if (recipientEmail) {
      this.mailService.sendDonationReceipt(recipientEmail, {
        donorName: dto.donorName || payment.donorName || 'Generous Donor',
        amount: payment.amount,
        currency: payment.currency,
        mealsSponsored: payment.mealsSponsored,
        campaignName: updatedPayment.campaign?.name,
        paymentId: dto.razorpayPaymentId,
        orderId: dto.razorpayOrderId,
      });
    }

    return {
      success: true,
      message: `Payment verified! ${payment.mealsSponsored} meals successfully funded.`,
      payment: updatedPayment,
    };
  }

  async getRecentDonations(limit = 10) {
    return this.prisma.payment.findMany({
      where: { status: 'success' },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        campaign: { select: { id: true, name: true, unit: true } },
        user: { select: { id: true, username: true } },
      },
    });
  }

  async getMyDonations(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId, status: 'success' },
      orderBy: { createdAt: 'desc' },
      include: {
        campaign: { select: { id: true, name: true, unit: true } },
      },
    });
  }
}
