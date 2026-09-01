import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @Min(1)
  amount: number; // In Rupees / base unit (e.g., 250 for 10 meals)

  @IsString()
  @IsOptional()
  currency?: string = 'INR';

  @IsString()
  @IsOptional()
  campaignId?: string;

  @IsNumber()
  @IsOptional()
  mealsSponsored?: number;

  @IsString()
  @IsOptional()
  donorName?: string;

  @IsString()
  @IsOptional()
  donorEmail?: string;
}

export class VerifyPaymentDto {
  @IsString()
  razorpayOrderId: string;

  @IsString()
  razorpayPaymentId: string;

  @IsString()
  razorpaySignature: string;

  @IsString()
  @IsOptional()
  donorName?: string;

  @IsString()
  @IsOptional()
  donorEmail?: string;
}
