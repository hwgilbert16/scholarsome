import {
  IsNotEmpty,
  IsOptional,
  IsString
} from "class-validator";

export class CreateSetFromApkgDto {
  @IsString()
  @IsNotEmpty()
    title: string;

  @IsString()
  @IsOptional()
    description: string;

  // this is needed to be submitted as string because form-data is used for this endpoint
  // for the file upload, and there is no boolean option for it
  @IsString()
  @IsNotEmpty()
    private: string;
}
