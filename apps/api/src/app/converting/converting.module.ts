import { Module } from "@nestjs/common";
import { SetsModule } from "../sets/sets.module";
import { UsersModule } from "../users/users.module";
import { CardsModule } from "../cards/cards.module";
import { ConvertingController } from "./converting.controller";
import { ConvertingService } from "./converting.service";
import { AuthModule } from "../auth/auth.module";
import { StorageModule } from "../providers/storage/storage.module";
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    SetsModule,
    UsersModule,
    CardsModule,
    AuthModule,
    StorageModule,
    ThrottlerModule.forRoot([{
      ttl: 30000,
      limit: 5
    }])
  ],
  controllers: [ConvertingController],
  providers: [ConvertingService]
})
export class ConvertingModule {}
