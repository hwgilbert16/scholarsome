import { IsArray, IsNumber, IsOptional, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateLeitnerSetDto {
  @ApiProperty({
    description: "The number of cards that will be studied each session",
    required: true
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
    cardsPerSession: number;

  @ApiProperty({
    description: "Array of the IDs of cards that have not been learned during the current 24-hour study session. Overwrites existing array.",
    required: true
  })
  @IsArray()
  @IsOptional()
    unlearnedCards: string[];
}
