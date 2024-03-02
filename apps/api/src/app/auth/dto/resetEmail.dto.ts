import { IsNotEmpty, IsString } from "class-validator";

export class ResetEmailDto {
    @IsString()
    @IsNotEmpty()
      newEmail: string;
}
