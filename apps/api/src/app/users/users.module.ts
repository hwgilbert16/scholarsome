import { Module } from '@nestjs/common';
import { UsersService } from "./users.service";
import { DatabaseModule } from "../providers/database/database.module";

@Module({
  imports: [DatabaseModule],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
