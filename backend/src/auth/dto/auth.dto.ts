import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(72, { message: 'Password cannot exceed 72 characters' }) // bcrypt only uses the first 72 bytes
  password: string;

  @IsString()
  @MinLength(2, { message: 'Username must be at least 2 characters' })
  @MaxLength(50, { message: 'Username cannot exceed 50 characters' })
  @Matches(/^[\w .-]+$/, { message: 'Username can only contain letters, numbers, spaces, . _ and -' })
  username: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MaxLength(72)
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
