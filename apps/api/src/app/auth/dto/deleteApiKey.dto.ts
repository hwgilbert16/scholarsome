import { IsNotEmpty, IsString } from "class-validator";

export class DeleteApiKeyDto {
  @IsString()
  @IsNotEmpty()
    apiKey: string;
}
