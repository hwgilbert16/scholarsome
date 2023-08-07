import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CardValidator {
  @IsOptional()
  @IsString()
    id: string;

  @IsNumber()
  @IsNotEmpty()
    index: number;

  @IsString()
  @IsNotEmpty()
    term: string;

  @IsString()
  @IsNotEmpty()
    definition: string;
}
