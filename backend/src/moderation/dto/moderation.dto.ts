import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  targetType: string;

  @IsString()
  @IsNotEmpty()
  targetId: string;

  @IsString()
  @IsOptional()
  targetUserId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Please provide a reason for the report' })
  @MaxLength(500)
  reason: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  details?: string;
}
