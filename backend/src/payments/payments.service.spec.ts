import * as crypto from 'crypto';
import { BadRequestException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { PaymentsService, safeHexEqual } from './payments.service';

/**
 * Minimal in-memory stand-in for Prisma: just enough to exercise the payment state machine.
 */
function makePrisma(initialStatus = 'created') {
  const payment = {
    id: 'p1',
    orderId: 'order_1',
    status: initialStatus,
    amount: 50000,
    currency: 'INR',
    mealsSponsored: 20,
    userId: 'u1',
    campaignId: 'c1',
    donorName: 'Donor',
    donorEmail: null as string | null,
    campaign: { name: 'Relief' },
  };
  const prisma = {
    payment: {
      updateMany: jest.fn(async ({ where, data }: any) => {
        if (where.orderId === payment.orderId && where.status === payment.status) {
          Object.assign(payment, data);
          return { count: 1 };
        }
        return { count: 0 };
      }),
      findUnique: jest.fn(async ({ where }: any) => (where.orderId === payment.orderId ? { ...payment } : null)),
    },
    impactCampaign: { update: jest.fn() },
    impactRecord: { create: jest.fn() },
    user: { update: jest.fn() },
    $transaction: jest.fn(async (ops: unknown[]) => ops),
  };
  return { prisma, payment };
}

const mail = { sendDonationReceipt: jest.fn().mockResolvedValue(true) };
const sign = (body: string, secret: string) => crypto.createHmac('sha256', secret).update(body).digest('hex');

describe('PaymentsService', () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
    jest.clearAllMocks();
  });

  describe('verifyPayment', () => {
    it('rejects a forged signature and marks the order failed', async () => {
      process.env.RAZORPAY_KEY_SECRET = 'test_secret';
      const { prisma, payment } = makePrisma();
      const svc = new PaymentsService(prisma as any, mail as any);

      await expect(
        svc.verifyPayment({ razorpayOrderId: 'order_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'deadbeef' }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(payment.status).toBe('failed');
      expect(prisma.impactCampaign.update).not.toHaveBeenCalled();
    });

    it('accepts a valid signature and credits the campaign once', async () => {
      process.env.RAZORPAY_KEY_SECRET = 'test_secret';
      const { prisma } = makePrisma();
      const svc = new PaymentsService(prisma as any, mail as any);
      const dto = {
        razorpayOrderId: 'order_1',
        razorpayPaymentId: 'pay_1',
        razorpaySignature: sign('order_1|pay_1', 'test_secret'),
      };

      const first = await svc.verifyPayment(dto);
      const replay = await svc.verifyPayment(dto);

      expect(first.alreadyProcessed).toBe(false);
      expect(replay.alreadyProcessed).toBe(true);
      expect(prisma.$transaction).toHaveBeenCalledTimes(1); // replay did not add meals again
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
    });

    it('refuses to run unsigned in production', async () => {
      delete process.env.RAZORPAY_KEY_SECRET;
      process.env.NODE_ENV = 'production';
      const { prisma } = makePrisma();
      const svc = new PaymentsService(prisma as any, mail as any);

      await expect(
        svc.verifyPayment({ razorpayOrderId: 'order_1', razorpayPaymentId: 'pay_1', razorpaySignature: 'x' }),
      ).rejects.toBeInstanceOf(ServiceUnavailableException);
    });
  });

  describe('handleWebhook', () => {
    const body = JSON.stringify({
      event: 'payment.captured',
      payload: { payment: { entity: { id: 'pay_9', order_id: 'order_1' } } },
    });

    it('rejects a bad signature', async () => {
      process.env.RAZORPAY_WEBHOOK_SECRET = 'wh_secret';
      const { prisma } = makePrisma();
      const svc = new PaymentsService(prisma as any, mail as any);
      await expect(svc.handleWebhook(Buffer.from(body), 'nope')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('marks the order paid on payment.captured', async () => {
      process.env.RAZORPAY_WEBHOOK_SECRET = 'wh_secret';
      const { prisma, payment } = makePrisma();
      const svc = new PaymentsService(prisma as any, mail as any);
      const res = await svc.handleWebhook(Buffer.from(body), sign(body, 'wh_secret'));
      expect(res.received).toBe(true);
      expect(payment.status).toBe('success');
    });
  });

  it('safeHexEqual handles length mismatch without throwing', () => {
    expect(safeHexEqual('abcd', 'ab')).toBe(false);
    expect(safeHexEqual('abcd', undefined)).toBe(false);
    expect(safeHexEqual('abcd', 'abcd')).toBe(true);
  });
});
