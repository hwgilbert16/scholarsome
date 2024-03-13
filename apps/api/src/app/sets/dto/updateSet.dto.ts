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
    example: "Example set",
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
    example: "This is an example of a folder description",
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
    example: false,
    required: false
  })
  @IsBoolean()
  @IsOptional()
    private?: boolean;

  @ApiProperty({
    description: "The IDs of folders that this set is apart of",
    example: ["0cac6b82-897e-4e5e-b51a-3a157e23e9e5", "bfeec5b3-7272-4d22-aa5a-3503610076d5"],
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
