import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCardDto {
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
    index?: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
    term?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
    definition?: string;
}
