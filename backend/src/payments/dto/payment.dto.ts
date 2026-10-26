import { IsString, IsNumber, IsOptional, Min, Max, IsEmail, IsMongoId, MaxLength, Matches } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @Min(25, { message: 'Minimum sponsorship is ₹25 (1 meal)' })
  @Max(500000)
  amount: number; // In rupees

  @IsMongoId()
  @IsOptional()
  campaignId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  donorName?: string;

  @IsEmail()
  @IsOptional()
  donorEmail?: string;
}

export class VerifyPaymentDto {
  @IsString()
  @MaxLength(100)
  razorpayOrderId: string;

  @IsString()
  @MaxLength(100)
  razorpayPaymentId: string;

  @IsString()
  @Matches(/^[\w-]{1,128}$/)
  razorpaySignature: string;
}
