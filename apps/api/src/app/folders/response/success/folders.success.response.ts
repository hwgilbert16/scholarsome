import { ApiProperty } from "@nestjs/swagger";
import { CompleteFolderEntity } from "../complete-folder.folders.entity";

export class FoldersSuccessResponse {
  @ApiProperty({
    description: "Denotes whether the request was successful or not",
    example: "success"
  })
    status: string;

  @ApiProperty({
    description: "Response data",
    type: [CompleteFolderEntity]
  })
    data: [CompleteFolderEntity];
}
