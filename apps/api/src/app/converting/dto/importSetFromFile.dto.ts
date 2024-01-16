import {
  IsNotEmpty,
  IsOptional,
  IsString
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
// needed for multer file type declaration
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { Multer } from "multer";
import { Transform, TransformFnParams } from "class-transformer";
import * as sanitizeHtml from "sanitize-html";

export class ImportSetFromFileDto {
  @ApiProperty({
    description: "The title of the set"
  })
  @IsString()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    title: string;

  @ApiProperty({
    description: "The description of the set",
    required: false
  })
  @IsString()
  @IsOptional()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    description: string;

  // this is needed to be submitted as string because form-data is used for this endpoint
  // for the file upload, and there is no boolean option for it
  @ApiProperty({
    description: "Whether the set is private"
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
