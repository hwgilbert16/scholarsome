import { Module } from "@nestjs/common";
import { SetsModule } from "../sets/sets.module";
import { UsersModule } from "../users/users.module";
import { CardsModule } from "../cards/cards.module";
import { ConvertingController } from "./converting.controller";
import { ConvertingService } from "./converting.service";
import { AuthModule } from "../auth/auth.module";
import { StorageModule } from "../providers/storage/storage.module";

@Module({
  imports: [
    SetsModule,
    UsersModule,
    CardsModule,
    AuthModule,
    StorageModule
  ],
  controllers: [ConvertingController],
  providers: [ConvertingService]
})
export class ConvertingModule {}
