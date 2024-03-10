import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID, MaxLength,
  ValidateNested
} from "class-validator";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CardValidator } from "../validator/card.validator";
import * as sanitizeHtml from "sanitize-html";

export class CreateSetDto {
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
    required: false,
    maxLength: 65535
  })
  @IsString()
  @IsOptional()
  @MaxLength(65535)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    description: string;

  @ApiProperty({
    description: "Whether the set is private",
    example: true
  })
  @IsBoolean()
  @IsNotEmpty()
    private: boolean;

  @ApiProperty({
    description: "The IDs of folders that this set is apart of",
    example: true
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  @IsUUID("4", { each: true })
    folders?: string[];

  @ApiProperty({
    description: "The cards contained within the set",
    type: [CardValidator]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CardValidator)
    cards: CardValidator[];
}
