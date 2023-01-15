import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCardBody {
  @IsNumber()
  @IsOptional()
  index?: number;

  @IsString()
  @IsOptional()
  term?: string;

  @IsString()
  @IsOptional()
  definition?: string;
}
