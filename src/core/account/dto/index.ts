import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username: string;
}

export class SignUpVerifyDto {
  @IsNotEmpty()
  accountId: string;

  @IsNotEmpty()
  code: string;
}
