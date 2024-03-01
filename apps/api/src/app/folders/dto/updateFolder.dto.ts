import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  Length
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import * as sanitizeHtml from "sanitize-html";

export class UpdateFolderDto {
  @ApiProperty({
    description: "The name of the folder",
    example: "Example folder"
  })
  @IsString()
  @IsOptional()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    name?: string;

  @ApiProperty({
    description: "The description of the folder",
    example: "This is an example of a folder description",
    required: false
  })
  @IsString()
  @IsOptional()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    description?: string;

  @ApiProperty({
    description: "The hex color of the folder",
    maxLength: 7,
    minLength: 7,
    example: "#495378"
  })
  @Length(7, 7)
  @IsString()
  @IsOptional()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    color?: string;

  @ApiProperty({
    description: "Whether the folder is private",
    example: true
  })
  @IsBoolean()
  @IsOptional()
    private?: boolean;

  @ApiProperty({
    description: "The ID of the folder to nest this folder within",
    example: true
  })
  @IsString()
  @IsOptional()
    parentFolderId: string;

  @ApiProperty({
    description: "The IDs of folders to nest within this folder",
    example: true
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  @IsUUID("4", { each: true })
    subfolders?: string[];

  @ApiProperty({
    description: "The IDs of sets to put within this folder",
    example: true
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  @IsUUID("4", { each: true })
    sets?: string[];
}
