import { Controller, Post, Get, Body, Query, Req, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import { Public } from '../auth/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /** Guests can donate; if a token is sent, the order is linked to that user. */
  @Public()
  @Post('create-order')
  async createOrder(@Body() dto: CreateOrderDto, @CurrentUser('sub') userId?: string) {
    return this.paymentsService.createOrder(dto, userId);
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }

  /** Razorpay → server. Authenticated by the X-Razorpay-Signature HMAC, not by a JWT. */
  @Public()
  @SkipThrottle()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Req() req: RawBodyRequest<Request>, @Headers('x-razorpay-signature') signature?: string) {
    return this.paymentsService.handleWebhook(req.rawBody, signature);
  }

  @Public()
  @Get('recent')
  async getRecentDonations(@Query('limit') limit?: string) {
    return this.paymentsService.getRecentDonations(limit ? parseInt(limit, 10) || 10 : 10);
  }

  @Get('my-donations')
  async getMyDonations(@CurrentUser('sub') userId: string) {
    return this.paymentsService.getMyDonations(userId);
  }
}
