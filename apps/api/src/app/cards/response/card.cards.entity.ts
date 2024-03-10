import { ApiProperty } from "@nestjs/swagger";
import { SetCardsEntity } from "./set.cards.entity";
import { MediaCardsEntity } from "../media.cards.entity";

export class CardCardsEntity {
  @ApiProperty({
    description: "The ID of the card",
    example: "27758237-5f57-4f6c-b483-6161056dad76"
  })
    id: string;

  @ApiProperty({
    description: "The ID of the set that the card belongs to",
    example: "77a72340-0b91-499e-9a06-0eee498d5aec"
  })
    setId: string;

  @ApiProperty({
    description: "The index of the card in the set",
    example: 0
  })
    index: number;

  @ApiProperty({
    description: "The front or \"term\" of the card",
    example: "The term of the card"
  })
    term: string;

  @ApiProperty({
    description: "The back or \"definition\" of the card",
    example: "The definition of the card"
  })
    definition: string;

  @ApiProperty({
    description: "ISO 8601 encoded time for when the card was created",
    example: "1970-01-01T00:00:00.000Z"
  })
    createdAt: string;

  @ApiProperty({
    description: "ISO 8601 encoded time for when the card was last updated",
    example: "1970-01-01T00:00:00.000Z"
  })
    updatedAt: string;

  @ApiProperty({
    description: "The set that this card is a member of",
    type: SetCardsEntity
  })
    set: SetCardsEntity;

  @ApiProperty({
    description: "File names of media contained within this card",
    required: false,
    type: [MediaCardsEntity]
  })
    media: [MediaCardsEntity];
}
