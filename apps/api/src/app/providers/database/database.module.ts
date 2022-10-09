import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { SetsService } from './sets/sets.service';

@Module({
  providers: [PrismaService, UsersService, SetsService],
  exports: [PrismaService, UsersService, SetsService],
})
export class DatabaseModule {}
