import { ApiProperty } from "@nestjs/swagger";

export class SetAvatarSuccessResponse {
  @ApiProperty({
    description: "Denotes whether the request was successful or not",
    example: "success"
  })
    status: string;

  @ApiProperty({
    description: "Response data",
    type: null
  })
    data: string;
}
