import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { UsersModule } from "../users/users.module";
import { SetsModule } from "../sets/sets.module";

@Module({
  imports: [UsersModule, SetsModule],
  controllers: [MediaController]
})
export class MediaModule {}
