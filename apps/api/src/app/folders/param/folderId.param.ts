import { IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FolderIdParam {
  @ApiProperty({
    description: "The ID of the folder",
    example: "72851aca-59ab-4d97-803b-62dccac848e0",
    minLength: 36,
    maxLength: 36
  })
  @IsUUID("4")
  @IsNotEmpty()
    folderId: string;
}
