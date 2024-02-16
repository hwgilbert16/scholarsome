import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString, IsUUID,
  Length
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams, Type } from "class-transformer";
import * as sanitizeHtml from "sanitize-html";

export class CreateFolderDto {
  @ApiProperty({
    description: "The name of the folder",
    example: "Example folder"
  })
  @IsString()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    name: string;

  @ApiProperty({
    description: "The description of the folder",
    example: "This is an example of a folder description",
    required: false
  })
  @IsString()
  @IsOptional()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    description: string;

  @ApiProperty({
    description: "The hex color of the folder",
    maxLength: 7,
    minLength: 7,
    example: "#495378"
  })
  @Length(7, 7)
  @IsString()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    color: string;

  @ApiProperty({
    description: "Whether the folder is private",
    example: true
  })
  @IsBoolean()
  @IsNotEmpty()
    private: boolean;

  @ApiProperty({
    description: "The IDs of sets to put within this folder",
    example: true
  })
  @IsArray()
  @ArrayMinSize(0)
  @Type(() => String)
  @IsUUID("4", { each: true, message: "Invalid UUID" })
    sets: string[];
}
