import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested
} from "class-validator";
import { Transform, TransformFnParams, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CardWithIdValidator } from "../validator/cardWithId.validator";
import * as sanitizeHtml from "sanitize-html";

export class UpdateSetDto {
  @ApiProperty({
    description: "The title or name of the set",
    required: false,
    maxLength: 191
  })
  @IsString()
  @IsOptional()
  @MaxLength(191)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    title?: string;

  @ApiProperty({
    description: "A description explaining what the set contains",
    required: false,
    maxLength: 65535
  })
  @IsString()
  @IsOptional()
  @MaxLength(65535)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    description?: string;

  @ApiProperty({
    description: "Whether the set is private",
    required: false
  })
  @IsBoolean()
  @IsOptional()
    private?: boolean;

  @ApiProperty({
    description: "The IDs of folders that this set is apart of",
    example: true,
    required: false
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  @IsUUID("4", { each: true })
    folders?: string[];

  @ApiProperty({
    description: "New cards to replace the existing ones in the set with",
    required: false,
    type: [CardWithIdValidator]
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CardWithIdValidator)
    cards?: CardWithIdValidator[];
}
