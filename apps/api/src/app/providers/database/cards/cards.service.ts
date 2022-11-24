import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, Card } from "@prisma/client";
import { CardWithRelations } from "@scholarsome/api-interfaces";

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async card(
    cardWhereUniqueInput: Prisma.CardWhereUniqueInput
  ): Promise<CardWithRelations | null> {
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
  }): Promise<CardWithRelations[]> {
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

  async createCard(data: Prisma.CardCreateInput): Promise<Card> {
    return this.prisma.card.create({
      data
    });
  }

  async updateCard(params: {
    where: Prisma.CardWhereUniqueInput;
    data: Prisma.CardUpdateInput;
  }): Promise<Card> {
    const { where, data } = params;
    return this.prisma.card.update({
      data,
      where
    });
  }

  async deleteCard(where: Prisma.CardWhereUniqueInput): Promise<Card> {
    return this.prisma.card.delete({
      where
    });
  }
}
