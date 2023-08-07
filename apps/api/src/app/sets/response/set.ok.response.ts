import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { SetEntity } from "./set.entity";

export class SetOkResponse {
  @ApiProperty({
    description: "Denotes whether the request was successful or not"
  })
    status: string;

  @ApiProperty({
    description: "Response data"
  })
  @Type(() => SetEntity)
    data: SetEntity;
}
