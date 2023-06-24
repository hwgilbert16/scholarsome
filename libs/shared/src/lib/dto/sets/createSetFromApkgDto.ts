import {
  IsBoolean,
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

  @IsBoolean()
  @IsNotEmpty()
    private: boolean;
}
