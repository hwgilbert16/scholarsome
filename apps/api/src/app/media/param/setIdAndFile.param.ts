import { IsNotEmpty, IsString } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { sanitize } from "sanitize-filename-ts";

export class SetIdAndFileParam {
  @IsString()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitize(params.value))
    setId: string;

  @IsString()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitize(params.value))
    file: string;
}
