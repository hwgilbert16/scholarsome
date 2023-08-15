import { ApiProperty } from "@nestjs/swagger";

export class SetUsersEntity {
  @ApiProperty({
    description: "The ID of the set",
    example: "77a72340-0b91-499e-9a06-0eee498d5aec"
  })
    id: string;

  @ApiProperty({
    description: "The ID of the author of the set",
    example: "1e3e00cf-6705-496a-b742-752cb30c6a6b"
  })
    authorId: string;

  @ApiProperty({
    description: "The title or name of the set",
    example: "Example set"
  })
    title: string;

  @ApiProperty({
    required: false,
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
