import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateSetBodyDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  private?: boolean;
}
