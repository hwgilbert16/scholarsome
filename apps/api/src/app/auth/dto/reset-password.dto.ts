import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsOptional()
  @MaxLength(72)
    existingPassword?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
    newPassword: string;
}
