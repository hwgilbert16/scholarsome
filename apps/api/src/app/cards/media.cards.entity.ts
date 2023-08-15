import { ApiProperty } from "@nestjs/swagger";

export class MediaCardsEntity {
  @ApiProperty({
    description: "The ID of the media",
    example: "27758237-5f57-4f6c-b483-6161056dad76"
  })
    id: string;

  @ApiProperty({
    description: "The ID of the card that the media belongs to",
    example: "77a72340-0b91-499e-9a06-0eee498d5aec"
  })
    cardId: string;

  @ApiProperty({
    description: "The file name of the media",
    example: "13247dcd-c265-4a02-9951-92401fb2b892.jpeg"
  })
    name: number;

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
}
