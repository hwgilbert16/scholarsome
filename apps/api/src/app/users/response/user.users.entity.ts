import { ApiProperty } from "@nestjs/swagger";
import { SetUsersEntity } from "./set.users.entity";

export class UserUsersEntity {
  @ApiProperty({
    description: "The ID of the user",
    example: "77a72340-0b91-499e-9a06-0eee498d5aec"
  })
    id: string;

  @ApiProperty({
    description: "The username of the user",
    example: "johndoe"
  })
    username: string;

  @ApiProperty({
    description: "The email of the user",
    required: false,
    example: "a@a.com"
  })
    email: string;

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

  @ApiProperty({
    description: "The sets that the user has created",
    type: [SetUsersEntity]
  })
    sets: [SetUsersEntity];
}
