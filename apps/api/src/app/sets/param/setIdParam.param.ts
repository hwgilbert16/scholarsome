import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SetIdParam {
  @ApiProperty({
    description: "The ID of the set",
    example: "19b86873-8e88-427b-839b-df02f1b8d5d8"
  })
  @IsString()
  @IsNotEmpty()
    setId: string;
}
