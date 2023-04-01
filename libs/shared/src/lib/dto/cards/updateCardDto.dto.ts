import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCardDto {
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
