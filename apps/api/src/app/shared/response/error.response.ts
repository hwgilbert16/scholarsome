import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponse {
  @ApiProperty({
    description: "Denotes whether the request was successful or not",
    example: "fail"
  })
    status: string;

  @ApiProperty({
    description: "The contents of the error",
    example: "This would contain the description of the error"
  })
    message: string;
}
