import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
    email: string;

  @IsString()
  @IsNotEmpty()
    password: string;

  @IsString()
  @IsNotEmpty()
    recaptchaToken: string;
}
