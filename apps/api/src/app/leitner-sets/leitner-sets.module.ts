import
{ forwardRef, Module } from "@nestjs/common";
import { LeitnerSetsController } from "./leitner-sets.controller";
import { LeitnerSetsService } from "./leitner-sets.service";
import { DatabaseModule } from "../providers/database/database.module";
import { SetsModule } from "../sets/sets.module";
import { UsersModule } from "../users/users.module";
import { LeitnerCardsModule } from "../leitner-cards/leitner-cards.module";

@Module({
  imports: [
    DatabaseModule,
    SetsModule,
    UsersModule,
    forwardRef(() => LeitnerCardsModule)
  ],
  controllers: [LeitnerSetsController],
  providers: [LeitnerSetsService],
  exports: [LeitnerSetsService]
})
export class LeitnerSetsModule {}
