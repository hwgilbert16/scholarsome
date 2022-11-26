import { Module } from '@nestjs/common';
import { DatabaseModule } from "../providers/database/database.module";
import { CardsController } from "./cards.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [CardsController]
})
export class CardsModule {}
