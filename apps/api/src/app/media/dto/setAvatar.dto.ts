import { ApiProperty } from "@nestjs/swagger";
// needed for multer file type declaration
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { Multer } from "multer";
import { IsOptional } from "class-validator";

export class SetAvatarDto {
  /*
  this dto only exists to annotate the api docs

  the file field is not optional, but it needs to be marked as optional here
  so that the interceptor can function
   */

  @ApiProperty({
    description: "The image file",
    type: "string",
    format: "binary"
  })
  @IsOptional()
    file: Express.Multer.File;
}
