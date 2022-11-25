import { IsString } from "class-validator";

export class AuthorIdParam {
  @IsString()
  authorId: string;
}
