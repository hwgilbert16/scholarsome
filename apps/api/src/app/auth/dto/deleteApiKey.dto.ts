import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DeleteApiKeyDto {
  @ApiProperty({
    description: "The ID of the API key",
    example: "384ecc57-28d6-4c33-8f41-a27ec3992b42"
  })
  @IsString()
  @IsNotEmpty()
    apiKey: string;
}
