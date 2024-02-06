import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsOptional()
    existingPassword?: string;

  @IsString()
  @IsNotEmpty()
    newPassword: string;
}
