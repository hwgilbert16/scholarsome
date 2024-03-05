import { ApiProperty } from "@nestjs/swagger";
import { PartialSetEntity } from "./partial-set.folders.entity";
import { PartialFolderEntity } from "./partial-folder.folders.entity";
import { PartialUserEntity } from "./partial-user.folders.entity";

export class CompleteFolderEntity {
  @ApiProperty({
    description: "The ID of the folder",
    example: "758d18ee-e709-49c0-8122-35c3a346d7e8"
  })
    id: string;

  @ApiProperty({
    description: "The ID of the folder to nest this folder within",
    example: "197ac7a2-8b42-4cbe-a4b7-bde496a36e1e"
  })
    parentFolderId: string;

  @ApiProperty({
    description: "The ID of the author of the folder",
    example: "7e58311d-33b0-4153-a1af-8baa7f8f62f6"
  })
    authorId: string;

  @ApiProperty({
    description: "The name of the folder",
    example: "Example set"
  })
    name: string;

  @ApiProperty({
    description: "A description explaining the contents of the folder",
    example: "This is an example of a folder description"
  })
    description: string;

  @ApiProperty({
    description: "The hex color of the folder",
    example: "#495378"
  })
    color: boolean;

  @ApiProperty({
    description: "Whether the set is private",
    example: true
  })
    private: boolean;

  @ApiProperty({
    description: "ISO 8601 encoded time for when the set was created",
    example: "1970-01-01T00:00:00.000Z"
  })
    createdAt: string;

  @ApiProperty({
    description: "ISO 8601 encoded time for when the set was last updated",
    example: "1970-01-01T00:00:00.000Z"
  })
    updatedAt: string;

  @ApiProperty({
    description: "The sets contained within the folder",
    type: [PartialSetEntity]
  })
    sets: [PartialSetEntity];

  @ApiProperty({
    description: "The subfolders of this folder",
    type: [PartialFolderEntity]
  })
    subfolders: [PartialFolderEntity];

  @ApiProperty({
    description: "The author of this folder",
    type: PartialUserEntity
  })
    author: [PartialUserEntity];
}
