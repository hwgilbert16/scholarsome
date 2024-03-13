import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class QuizletExportParams {
  @ApiProperty({
    description: "The ID of the set",
    example: "19b86873-8e88-427b-839b-df02f1b8d5d8",
    minLength: 36,
    maxLength: 36
  })
  @IsUUID("4")
  @IsNotEmpty()
    setId: string;

  @ApiProperty({
    description: "The character(s) to separate each side of a card",
    maxLength: 100,
    example: "["
  })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
    sideDiscriminator: string;

  @ApiProperty({
    description: "The character(s) to separate cards",
    maxLength: 100,
    example: "]"
  })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
    cardDiscriminator: string;
}
