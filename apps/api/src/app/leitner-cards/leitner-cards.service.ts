import { Injectable } from "@nestjs/common";
import { Prisma, LeitnerCard as PrismaLeitnerCard } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../providers/database/prisma/prisma.service";
import { LeitnerCard } from "@scholarsome/shared";

@Injectable()
export class LeitnerCardsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  /**
   * Queries the database for a unique `LeitnerCard`
   *
   * @param leitnerCardWhereUniqueInput Prisma `LeitnerCardWhereUniqueInput` selector object
   *
   * @returns Queried `Card` object
   */
  async leitnerCard(
      leitnerCardWhereUniqueInput: Prisma.LeitnerCardWhereUniqueInput
  ): Promise<LeitnerCard | null> {
    return this.prisma.leitnerCard.findUnique({
      where: leitnerCardWhereUniqueInput,
      select: {
        card: true,
        cardId: true,
        box: true,
        due: true
      }
    });
  }

  /**
   * Queries the database for multiple `LeitnerCard` objects
   *
   * @param params.skip Optional, Prisma skip selector
   * @param params.take Optional, Prisma take selector
   * @param params.cursor Optional, Prisma cursor selector
   * @param params.where Optional, Prisma where selector
   * @param params.orderBy Optional, Prisma orderBy selector
   *
   * @returns Array of queried `LeitnerCard` objects
   */
  async leitnerCards(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LeitnerCardWhereUniqueInput;
    where?: Prisma.LeitnerCardWhereInput;
    orderBy?: Prisma.LeitnerCardOrderByWithRelationInput;
  }): Promise<LeitnerCard[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.leitnerCard.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        card: true,
        cardId: true,
        box: true,
        due: true
      }
    });
  }

  /**
   * Updates a LeitnerCard in the database
   *
   * @param params.where Prisma where selector
   * @param params.data Prisma data selector
   *
   * @returns Updated `LeitnerCard` object
   */
  async updateLeitnerCard(params: {
    where: Prisma.LeitnerCardWhereUniqueInput;
    data: Prisma.LeitnerCardUpdateInput;
  }): Promise<PrismaLeitnerCard> {
    const { where, data } = params;
    return this.prisma.leitnerCard.update({
      data,
      where
    });
  }

  /**
   * Deletes a LeitnerCard from the database
   *
   * @param where Prisma LeitnerCardWhereUniqueInput selector
   *
   * @returns `LeitnerCard` object that was deleted
   */
  async deleteLeitnerCard(where: Prisma.LeitnerCardWhereUniqueInput): Promise<PrismaLeitnerCard> {
    return this.prisma.leitnerCard.delete({
      where
    });
  }
}
