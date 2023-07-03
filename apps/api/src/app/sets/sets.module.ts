import { forwardRef, Module } from "@nestjs/common";
import { SetsController } from "./sets.controller";
import { DatabaseModule } from "../providers/database/database.module";
import { SetsService } from "./sets.service";
import { UsersModule } from "../users/users.module";
import { CardsModule } from "../cards/cards.module";

@Module({
  imports: [DatabaseModule, UsersModule, forwardRef(() => CardsModule)],
  controllers: [SetsController],
  providers: [SetsService],
  exports: [SetsService]
})
export class SetsModule {}
