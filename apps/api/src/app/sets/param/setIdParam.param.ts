import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SetIdParam {
  @ApiProperty({
    description: "The ID of the set",
    example: "19b86873-8e88-427b-839b-df02f1b8d5d8",
    minLength: 36,
    maxLength: 36
  })
  @IsUUID("4")
    setId: string;
}
