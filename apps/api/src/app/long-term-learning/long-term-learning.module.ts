import { Module } from "@nestjs/common";
import { LongTermLearningController } from "./long-term-learning.controller";
import { LongTermLearningService } from "./long-term-learning.service";
import { DatabaseModule } from "../providers/database/database.module";
import { UsersModule } from "../users/users.module";
import { SetsModule } from "../sets/sets.module";

@Module({
  imports: [DatabaseModule, UsersModule, SetsModule],
  controllers: [LongTermLearningController],
  providers: [LongTermLearningService]
})
export class LongTermLearningModule {}
