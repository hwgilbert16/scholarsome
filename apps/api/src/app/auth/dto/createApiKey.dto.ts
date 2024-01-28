import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateApiKeyDto {
  @ApiProperty({
    description: "The name to describe the purpose of the API key",
    example: "API Key #1"
  })
  @IsString()
  @IsNotEmpty()
    name: string;
}
