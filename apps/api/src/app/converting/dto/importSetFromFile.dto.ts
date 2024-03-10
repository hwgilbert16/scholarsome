import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import * as sanitizeHtml from "sanitize-html";

export class ImportSetFromFileDto {
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

  // this is needed to be submitted as string because form-data is used for this endpoint
  // for the file upload, and there is no boolean option for it
  @ApiProperty({
    description: "Whether the set is private",
    example: false
  })
  @IsString()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    private: string;

  @ApiProperty({
    description: "The file to import cards from",
    type: "string",
    format: "binary"
  })
    file: Express.Multer.File;
}
