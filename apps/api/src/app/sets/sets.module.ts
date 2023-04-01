import { Module } from '@nestjs/common';
import { SetsController } from './sets.controller';
import { DatabaseModule } from '../providers/database/database.module';
import { SetsService } from './sets.service';
import { UsersModule } from "../users/users.module";

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [SetsController],
  providers: [SetsService],
  exports: [SetsService]
})
export class SetsModule {}
