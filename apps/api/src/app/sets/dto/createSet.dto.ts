import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { CardValidator } from "../../cards/validator/card.validator";

export class CreateSetDto {
  @IsString()
  @IsNotEmpty()
    title: string;

  @IsString()
  @IsOptional()
    description: string;

  @IsBoolean()
  @IsNotEmpty()
    private: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CardValidator)
    cards: CardValidator[];
}
