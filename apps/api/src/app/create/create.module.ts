import { Module } from '@nestjs/common';
import { CreateController } from "./create.controller";
import { DatabaseModule } from "../providers/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [CreateController],
})
export class CreateModule {}
