import { Module } from "@nestjs/common";
import { SetsModule } from "../sets/sets.module";
import { UsersModule } from "../users/users.module";
import { CardsModule } from "../cards/cards.module";
import { ConvertingController } from "./converting.controller";
import { ConvertingService } from "./converting.service";

@Module({
  imports: [SetsModule, UsersModule, CardsModule],
  controllers: [ConvertingController],
  providers: [ConvertingService]
})
export class ConvertingModule {}
