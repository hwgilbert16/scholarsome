import { IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CardIdParam {
  @ApiProperty({
    description: "The ID of the card",
    example: "e2760057-13a4-4046-85a2-a14b9564b8a5",
    minLength: 36,
    maxLength: 36
  })
  @IsUUID("4")
  @IsNotEmpty()
    cardId: string;
}
