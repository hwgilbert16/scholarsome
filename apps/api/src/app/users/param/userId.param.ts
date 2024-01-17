import { IsNotEmpty, IsString } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { sanitize } from "sanitize-filename-ts";

export class UserIdParam {
  @IsString()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitize(params.value))
    userId: string;
}
