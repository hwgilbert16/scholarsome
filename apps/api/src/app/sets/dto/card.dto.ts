import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CardDto {
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
