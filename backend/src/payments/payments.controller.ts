import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import { Public } from '../auth/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Post('create-order')
  async createOrder(
    @Body() dto: CreateOrderDto,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.paymentsService.createOrder(dto, userId);
  }

  @Public()
  @Post('verify')
  async verifyPayment(
    @Body() dto: VerifyPaymentDto,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.paymentsService.verifyPayment(dto, userId);
  }

  @Public()
  @Get('recent')
  async getRecentDonations(@Query('limit') limit?: string) {
    return this.paymentsService.getRecentDonations(limit ? parseInt(limit, 10) : 10);
  }

  @Get('my-donations')
  async getMyDonations(@CurrentUser('sub') userId: string) {
    return this.paymentsService.getMyDonations(userId);
  }
}
