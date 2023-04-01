import { IsString } from "class-validator";

export class SetIdParam {
  @IsString()
    setId: string;
}
