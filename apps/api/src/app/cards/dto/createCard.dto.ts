import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import * as sanitizeHtml from "sanitize-html";

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
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: { "img": ["src"], "span": ["style"] },
    allowedSchemes: ["data"]
  }))
    term: string;

  @ApiProperty({
    description: "The back or \"definition\" of the card",
    example: "The definition of the card"
  })
  @IsString()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: { "img": ["src"], "span": ["style"] },
    allowedSchemes: ["data"]
  }))
    definition: string;
}
