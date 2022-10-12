import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsString, MaxLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CardDto } from "./card.dto";

export class CreateSetDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  private: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CardDto)
  cards: CardDto[];
}
