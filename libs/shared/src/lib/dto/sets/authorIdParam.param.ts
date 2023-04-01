import { IsNotEmpty, IsString } from "class-validator";

export class AuthorIdParam {
  @IsString()
  @IsNotEmpty()
    authorId: string;
}
