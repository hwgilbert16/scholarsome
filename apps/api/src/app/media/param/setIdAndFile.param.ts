import { IsNotEmpty, IsString } from "class-validator";

export class SetIdAndFileParam {
  @IsString()
  @IsNotEmpty()
    setId: string;

  @IsString()
  @IsNotEmpty()
    file: string;
}
