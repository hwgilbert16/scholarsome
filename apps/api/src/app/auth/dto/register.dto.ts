import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ValidationError } from "@api/shared/exception/annotations/validationError.decorator";

@ValidationError("Invalid registration credentials.")
export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: "username should not be empty" })
  username: string;

  @IsEmail({}, { message: "email must be valid" })
  @IsNotEmpty({ message: "email should not be empty" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "password should not be empty" })
  password: string;

  @IsString()
  @IsOptional()
  recaptchaToken: string;
}
