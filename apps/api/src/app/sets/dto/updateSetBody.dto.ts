import { ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CardDto } from "./card.dto";

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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CardDto)
  cards: CardDto[];
}
