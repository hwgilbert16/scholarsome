import { Injectable } from "@nestjs/common";
import { PrismaService } from "../providers/database/prisma/prisma.service";
import { Prisma, Card as PrismaCard } from "@prisma/client";
import { Card } from "@scholarsome/shared";

@Injectable()
export class CardsService {
  /**
   * @ignore
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Queries the database for a unique card
   *
   * @param cardWhereUniqueInput Prisma `CardWhereUniqueInput` selector object
   *
   * @returns Queried `Card` object
   */
  async card(
      cardWhereUniqueInput: Prisma.CardWhereUniqueInput
  ): Promise<Card | null> {
    return this.prisma.card.findUnique({
      where: cardWhereUniqueInput,
      include: { set: true }
    });
  }


  /**
   * Queries the database for multiple cards
   *
   * @param params.skip Optional, Prisma skip selector
   * @param params.take Optional, Prisma take selector
   * @param params.cursor Optional, Prisma cursor selector
   * @param params.where Optional, Prisma where selector
   * @param params.orderBy Optional, Prisma orderBy selector
   *
   * @returns Array of queried `Card` objects
   */
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

  /**
   * Creates a card in the database
   *
   * @param data Prisma `CardCreateInput` selector
   *
   * @returns Created `Card` object
   */
  async createCard(data: Prisma.CardCreateInput): Promise<PrismaCard> {
    return this.prisma.card.create({
      data
    });
  }

  /**
   * Updates a card in the database
   *
   * @param params.where Prisma where selector
   * @param params.data Prisma data selector
   *
   * @returns Updated `Card` object
   */
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


  /**
   * Deletes a card from the database
   *
   * @param where Prisma CardWhereUniqueInput selector
   *
   * @returns `Card` object that was deleted
   */
  async deleteCard(where: Prisma.CardWhereUniqueInput): Promise<PrismaCard> {
    return this.prisma.card.delete({
      where
    });
  }
}
