import { Module } from "@nestjs/common";
import { LeitnerCardsController } from "./leitner-cards.controller";
import { LeitnerCardsService } from "./leitner-cards.service";
import { UsersModule } from "../users/users.module";
import { LeitnerSetsModule } from "../leitner-sets/leitner-sets.module";
import { DatabaseModule } from "../providers/database/database.module";

@Module({
  imports: [
    UsersModule,
    LeitnerSetsModule,
    DatabaseModule
  ],
  controllers: [LeitnerCardsController],
  providers: [LeitnerCardsService]
})
export class LeitnerCardsModule {}
