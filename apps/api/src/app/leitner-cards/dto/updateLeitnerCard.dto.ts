import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";
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

  @ApiProperty({
    description: "Whether the card is now learned",
    required: true
  })
  @IsBoolean()
  @IsOptional()
    learned: boolean;

  @ApiProperty({
    description: "Time when the card will be next due",
    required: false
  })
  @IsDateString()
  @IsOptional()
    due: Date;
}
