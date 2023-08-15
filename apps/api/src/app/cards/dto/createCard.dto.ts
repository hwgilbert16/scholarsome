import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCardDto {
  @ApiProperty({
    description: "The ID of the set that the card will belong to",
    example: "27758237-5f57-4f6c-b483-6161056dad76"
  })
  @IsString()
  @IsNotEmpty()
    setId: string;

  @ApiProperty({
    description: "The index of the card in the set",
    example: 0
  })
  @IsNumber()
  @IsNotEmpty()
    index: number;

  @ApiProperty({
    description: "The front or \"term\" of the card",
    example: "The definition of the card"
  })
  @IsString()
  @IsNotEmpty()
    term: string;

  @ApiProperty({
    description: "The back or \"definition\" of the card",
    example: "The definition of the card"
  })
  @IsString()
  @IsNotEmpty()
    definition: string;
}
