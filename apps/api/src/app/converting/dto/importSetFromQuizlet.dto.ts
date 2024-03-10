import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import * as sanitizeHtml from "sanitize-html";

export class ImportSetFromQuizletDto {
  @ApiProperty({
    description: "The title of the set",
    example: "Example set",
    maxLength: 191
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    title: string;

  @ApiProperty({
    description: "The description of the set",
    example: "This is an example of a set description",
    maxLength: 65535,
    required: false
  })
  @IsString()
  @IsOptional()
  @MaxLength(65535)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    description: string;

  @ApiProperty({
    description: "Whether the set is private",
    example: false
  })
  @IsBoolean()
  @IsNotEmpty()
    private: boolean;

  @ApiProperty({
    description: "The character(s) that separate each side of a card",
    example: "[",
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    sideDiscriminator: string;

  @ApiProperty({
    description: "The character(s) that separate the cards",
    example: "]",
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    cardDiscriminator: string;

  @ApiProperty({
    description: "The paragraph of text that contains the cards from Quizlet",
    example: "card1[card2]card3[card4]"
  })
  @IsString()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    set: string;
}
