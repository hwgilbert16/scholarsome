import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(191)
    email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
    password: string;

  @IsString()
  @IsOptional()
  @MaxLength(191)
    recaptchaToken: string;
}
