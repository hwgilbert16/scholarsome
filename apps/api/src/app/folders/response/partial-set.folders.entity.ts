import { ApiProperty } from "@nestjs/swagger";

export class PartialSetEntity {
  @ApiProperty({
    description: "The ID of the set",
    example: "77a72340-0b91-499e-9a06-0eee498d5aec"
  })
    id: string;

  @ApiProperty({
    description: "The ID of the author of the set",
    example: "7e58311d-33b0-4153-a1af-8baa7f8f62f6"
  })
    authorId: string;

  @ApiProperty({
    description: "The title or name of the set",
    example: "Example set"
  })
    title: string;

  @ApiProperty({
    description: "A description explaining what the set contains",
    example: "This is an example of a set description"
  })
    description: string;

  @ApiProperty({
    description: "Whether the set is private",
    example: true
  })
    private: boolean;

  @ApiProperty({
    description: "ISO 8601 encoded time for when the set was created",
    example: "1970-01-01T00:00:00.000Z"
  })
    createdAt: string;

  @ApiProperty({
    description: "ISO 8601 encoded time for when the set was last updated",
    example: "1970-01-01T00:00:00.000Z"
  })
    updatedAt: string;
}
