import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ResetEmailDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(191)
      newEmail: string;
}
