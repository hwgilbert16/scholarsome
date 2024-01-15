import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import * as sanitizeHtml from "sanitize-html";

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
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: { "img": ["src"], "span": ["style"] },
    allowedSchemes: ["data"]
  }))
    term?: string;

  @ApiProperty({
    description: "The back or \"definition\" of the card",
    example: "The definition of the card"
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: { "img": ["src"], "span": ["style"] },
    allowedSchemes: ["data"]
  }))
    definition?: string;
}
