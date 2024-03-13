import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsHexColor,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import * as sanitizeHtml from "sanitize-html";

export class UpdateFolderDto {
  @ApiProperty({
    description: "The name of the folder",
    example: "Example folder",
    required: false,
    maxLength: 191
  })
  @IsString()
  @IsOptional()
  @MaxLength(191)
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    name?: string;

  @ApiProperty({
    description: "The description of the folder",
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
    description: "The hex color of the folder",
    maxLength: 7,
    minLength: 7,
    example: "#495378",
    required: false
  })
  @Length(7, 7)
  @IsOptional()
  @IsHexColor()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    color?: string;

  @ApiProperty({
    description: "Whether the folder is private",
    example: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
    private?: boolean;

  @ApiProperty({
    description: "The ID of the folder to nest this folder within",
    example: "197ac7a2-8b42-4cbe-a4b7-bde496a36e1e",
    required: false,
    maxLength: 36,
    minLength: 36
  })
  @IsUUID("4")
  @IsOptional()
    parentFolderId: string;

  @ApiProperty({
    description: "The IDs of folders to nest within this folder",
    example: ["33b957d5-eb66-421f-8019-cf8a3ccbde32"],
    required: false
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  @IsUUID("4", { each: true })
    subfolders?: string[];

  @ApiProperty({
    description: "The IDs of sets to nest within this folder",
    example: ["19b2337a-654c-4b2c-a746-aa93aaeb948f"],
    required: false
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  @IsUUID("4", { each: true })
    sets?: string[];
}
