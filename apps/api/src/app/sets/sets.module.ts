import { forwardRef, Module } from "@nestjs/common";
import { SetsController } from "./sets.controller";
import { DatabaseModule } from "../providers/database/database.module";
import { SetsService } from "./sets.service";
import { UsersModule } from "../users/users.module";
import { CardsModule } from "../cards/cards.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    forwardRef(() => CardsModule),
    AuthModule
  ],
  controllers: [SetsController],
  providers: [SetsService],
  exports: [SetsService]
})
export class SetsModule {}
