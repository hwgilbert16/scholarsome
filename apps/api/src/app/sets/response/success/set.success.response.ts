import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { SetEntity } from "../set.entity";

export class SetSuccessResponse {
  @ApiProperty({
    description: "Denotes whether the request was successful or not",
    example: "success"
  })
    status: string;

  @ApiProperty({
    description: "Response data"
  })
  @Type(() => SetEntity)
    data: SetEntity;
}
