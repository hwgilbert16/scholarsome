import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponse {
  @ApiProperty({
    description: "Denotes whether the server or client is at fault in the error. \"error\" indicates that the server is at fault, while \"fail\" indicates that the client is at fault.",
    example: "fail"
  })
    status: string;

  @ApiProperty({
    description: "The contents of the error",
    example: "This would contain the description of the error"
  })
    message: string;
}
