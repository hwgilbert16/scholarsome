import { Module } from '@nestjs/common';
import { DatabaseModule } from "../providers/database/database.module";
import { UsersController } from "./users.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController]
})
export class UsersModule {}
