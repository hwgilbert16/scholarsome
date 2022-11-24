import { Module } from "@nestjs/common";
import { SetsController } from "./sets.controller";
import { DatabaseModule } from "../providers/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [SetsController]
})
export class SetsModule {}
