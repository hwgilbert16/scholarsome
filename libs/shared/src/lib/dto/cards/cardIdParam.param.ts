import { IsNotEmpty, IsString } from "class-validator";

export class CardIdParam {
  @IsString()
  @IsNotEmpty()
  cardId: string;
}
