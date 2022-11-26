import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';
import { SetsService } from './sets/sets.service';
import { CardsService } from './cards/cards.service';

@Module({
  providers: [PrismaService, UsersService, SetsService, CardsService],
  exports: [PrismaService, UsersService, SetsService, CardsService]
})
export class DatabaseModule {}
