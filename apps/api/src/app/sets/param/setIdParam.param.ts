import { IsNotEmpty, IsString } from "class-validator";

export class SetIdParam {
  @IsString()
  @IsNotEmpty()
    setId: string;
}
