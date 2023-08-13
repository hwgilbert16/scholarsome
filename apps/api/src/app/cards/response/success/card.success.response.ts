import { ApiProperty } from "@nestjs/swagger";
import { CardCardsEntity } from "../card.cards.entity";

export class CardSuccessResponse {
  @ApiProperty({
    description: "Denotes whether the request was successful or not",
    example: "success"
  })
    status: string;

  @ApiProperty({
    description: "Response data",
    type: CardCardsEntity
  })
    data: CardCardsEntity;
}
