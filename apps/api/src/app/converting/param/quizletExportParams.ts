import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class QuizletExportParams {
  @ApiProperty({
    description: "The ID of the set",
    example: "19b86873-8e88-427b-839b-df02f1b8d5d8"
  })
  @IsString()
  @IsNotEmpty()
    setId: string;

  @ApiProperty({
    description: "The character(s) to separate each side of a card",
    example: "["
  })
  @IsString()
  @IsNotEmpty()
    sideDiscriminator: string;

  @ApiProperty({
    description: "The character(s) to separate cards",
    example: "["
  })
  @IsString()
  @IsNotEmpty()
    cardDiscriminator: string;
}
