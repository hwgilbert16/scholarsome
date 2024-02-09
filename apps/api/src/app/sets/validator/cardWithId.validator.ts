import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import * as sanitizeHtml from "sanitize-html";

export class CardWithIdValidator {
  @IsOptional()
  @IsString()
    id: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
    index: number;

  @IsString()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: { "img": ["src", "width", "height"], "span": ["style"] },
    allowedSchemes: ["data"]
  }))
    term: string;

  @IsString()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: { "img": ["src", "width", "height"], "span": ["style"] },
    allowedSchemes: ["data"]
  }))
    definition: string;
}
