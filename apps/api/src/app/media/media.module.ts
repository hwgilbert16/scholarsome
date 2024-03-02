import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { UsersModule } from "../users/users.module";
import { SetsModule } from "../sets/sets.module";
import { AuthModule } from "../auth/auth.module";
import { StorageModule } from "../providers/storage/storage.module";

@Module({
  imports: [
    UsersModule,
    SetsModule,
    AuthModule,
    StorageModule
  ],
  controllers: [MediaController]
})
export class MediaModule {}
