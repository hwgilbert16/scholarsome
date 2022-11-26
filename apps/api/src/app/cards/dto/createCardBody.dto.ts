import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCardBody {
  @IsString()
  @IsNotEmpty()
  setId: string;

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
