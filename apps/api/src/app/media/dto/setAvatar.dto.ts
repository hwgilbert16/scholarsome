import { ApiProperty } from "@nestjs/swagger";
// needed for multer file type declaration
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { Multer } from "multer";

export class SetAvatarDto {
  @ApiProperty({
    description: "The image file",
    type: "string",
    format: "binary"
  })
    file: Express.Multer.File;
}
