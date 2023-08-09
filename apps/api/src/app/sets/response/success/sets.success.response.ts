import { ApiProperty } from "@nestjs/swagger";
import { SetEntity } from "../set.entity";

export class SetsSuccessResponse {
  @ApiProperty({
    description: "Denotes whether the request was successful or not",
    example: "success"
  })
    status: string;

  @ApiProperty({
    description: "Response data",
    type: [SetEntity]
  })
    data: SetEntity;
}
