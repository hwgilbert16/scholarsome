import { IsNotEmpty, IsUUID } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { sanitize } from "sanitize-filename-ts";
import { ApiProperty } from "@nestjs/swagger";

export class UserIdParam {
  @ApiProperty({
    description: "The ID of the user",
    example: "da692ac2-64b0-4a9b-9f3a-ff521a312b7f",
    minLength: 36,
    maxLength: 36
  })
  @IsNotEmpty()
  @IsUUID("4")
  @Transform((params: TransformFnParams) => sanitize(params.value))
    userId: string;
}
