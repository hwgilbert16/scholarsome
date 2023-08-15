import { ApiProperty } from "@nestjs/swagger";
import { UserUsersEntity } from "../user.users.entity";

export class UserSuccessResponse {
  @ApiProperty({
    description: "Denotes whether the request was successful or not",
    example: "success"
  })
    status: string;

  @ApiProperty({
    description: "Response data",
    type: UserUsersEntity
  })
    data: UserUsersEntity;
}
