import {
  IsNotEmpty,
  IsOptional,
  IsString
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
// needed for multer file type declaration
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { Multer } from "multer";

export class CreateSetFromApkgDto {
  @ApiProperty({
    description: "The title of the set"
  })
  @IsString()
  @IsNotEmpty()
    title: string;

  @ApiProperty({
    description: "The description of the set",
    required: false
  })
  @IsString()
  @IsOptional()
    description: string;

  // this is needed to be submitted as string because form-data is used for this endpoint
  // for the file upload, and there is no boolean option for it
  @ApiProperty({
    description: "Whether the set is private"
  })
  @IsString()
  @IsNotEmpty()
    private: string;

  @ApiProperty()
    file: Express.Multer.File;
}
