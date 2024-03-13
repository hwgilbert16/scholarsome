import { ApiProperty } from "@nestjs/swagger";

export class PartialUserEntity {
  @ApiProperty({
    description: "The ID of the user",
    example: "965b1e21-d531-4bc4-88a2-03c8ac1e8d95"
  })
    id: string;

  @ApiProperty({
    description: "The username of the user",
    example: "JohnDoe"
  })
    username: string;

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
