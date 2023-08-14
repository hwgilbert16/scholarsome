import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CardValidator {
  @ApiProperty({
    description: "The index of the card in the set",
    example: 0
  })
  @IsNumber()
  @IsNotEmpty()
    index: number;

  @ApiProperty({
    description: "The front or \"term\" of the card",
    example: "The term of the card"
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
