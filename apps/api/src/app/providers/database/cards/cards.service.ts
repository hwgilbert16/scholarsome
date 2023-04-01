import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, Card as PrismaCard } from "@prisma/client";
import { Card } from '@scholarsome/shared';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async card(
    cardWhereUniqueInput: Prisma.CardWhereUniqueInput
  ): Promise<Card | null> {
    return this.prisma.card.findUnique({
      where: cardWhereUniqueInput,
      include: { set: true }
    });
  }

  async cards(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CardWhereUniqueInput;
    where?: Prisma.CardWhereInput;
    orderBy?: Prisma.CardOrderByWithRelationInput;
  }): Promise<Card[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.card.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        set: true
      }
    });
  }

  async createCard(data: Prisma.CardCreateInput): Promise<PrismaCard> {
    return this.prisma.card.create({
      data
    });
  }

  async updateCard(params: {
    where: Prisma.CardWhereUniqueInput;
    data: Prisma.CardUpdateInput;
  }): Promise<PrismaCard> {
    const { where, data } = params;
    return this.prisma.card.update({
      data,
      where
    });
  }

  async deleteCard(where: Prisma.CardWhereUniqueInput): Promise<PrismaCard> {
    return this.prisma.card.delete({
      where
    });
  }
}
