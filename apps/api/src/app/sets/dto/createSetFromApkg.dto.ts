import {
  IsNotEmpty,
  IsOptional,
  IsString
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSetFromApkgDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    description: string;

  // this is needed to be submitted as string because form-data is used for this endpoint
  // for the file upload, and there is no boolean option for it
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    private: string;
}
