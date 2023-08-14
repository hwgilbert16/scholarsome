import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCardDto {
  @ApiProperty({
    description: "The index of the card in the set",
    required: false
  })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
    index?: number;

  @ApiProperty({
    description: "The front or \"term\" of the card",
    example: "The definition of the card"
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
    term?: string;

  @ApiProperty({
    description: "The back or \"definition\" of the card",
    example: "The definition of the card"
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
    definition?: string;
}
