import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateLeitnerCardDto {
  @ApiProperty({
    description: "The \"box\" that the card is currently in",
    required: true
  })
  @IsNumber()
  @Min(2)
  @IsNotEmpty()
    box: number;
}
