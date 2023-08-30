import { IsNumber, IsOptional, Min } from "class-validator";
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
}
