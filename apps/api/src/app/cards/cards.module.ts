import { Module } from "@nestjs/common";
import { DatabaseModule } from "../providers/database/database.module";
import { CardsController } from "./cards.controller";
import { CardsService } from "./cards.service";
import { SetsModule } from "../sets/sets.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [DatabaseModule, SetsModule, UsersModule],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService]
})
export class CardsModule {}
