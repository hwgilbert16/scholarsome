import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
    username: string;

  @IsEmail()
  @IsNotEmpty()
    email: string;

  @IsString()
  @IsNotEmpty()
    password: string;

  @IsString()
  @IsOptional()
    recaptchaToken: string;
}
