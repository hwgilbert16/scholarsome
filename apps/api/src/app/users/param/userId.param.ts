import { IsNotEmpty, IsString } from "class-validator";

export class UserIdParam {
  @IsString()
  @IsNotEmpty()
    userId: string;
}
