import { Injectable } from "@nestjs/common";
import { Prisma, LongTermLearning as PrismaLongTermLearning } from "@prisma/client";
import { PrismaService } from "../providers/database/prisma/prisma.service";
import { LongTermLearning } from "@scholarsome/shared";

@Injectable()
export class LongTermLearningService {
  /**
   * @ignore
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Queries the database for a unique LongTermLearning object
   *
   * @param longTermLearningWhereUniqueInput Prisma `LongTermLearningWhereUniqueInput` selector object
   *
   * @returns Queried `LongTermLearning` object
   */
  async longTermLearning(
      longTermLearningWhereUniqueInput: Prisma.LongTermLearningWhereUniqueInput
  ): Promise<LongTermLearning | null> {
    return this.prisma.longTermLearning.findUnique({
      where: longTermLearningWhereUniqueInput,
      include: {
        set: true,
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true
          }
        },
        learningCards: true
      }
    });
  }


  /**
   * Queries the database for multiple LongTermLearning objects
   *
   * @param params.skip Optional, Prisma skip selector
   * @param params.take Optional, Prisma take selector
   * @param params.cursor Optional, Prisma cursor selector
   * @param params.where Optional, Prisma where selector
   * @param params.orderBy Optional, Prisma orderBy selector
   *
   * @returns Array of queried `LongTermLearning` objects
   */
  async longTermLearnings(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LongTermLearningWhereUniqueInput;
    where?: Prisma.LongTermLearningWhereInput;
    orderBy?: Prisma.LongTermLearningOrderByWithRelationInput;
  }): Promise<LongTermLearning[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.longTermLearning.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        set: true,
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true
          }
        },
        learningCards: true
      }
    });
  }

  /**
   * Creates a LongTermLearning object in the database
   *
   * @param data Prisma `LongTermLearningCreateInput` selector
   *
   * @returns Created `LongTermLearning` object
   */
  async createLongTermLearning(data: Prisma.LongTermLearningCreateInput): Promise<PrismaLongTermLearning> {
    return this.prisma.longTermLearning.create({
      data,
      include: {
        set: true,
        user: {
          select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true
          }
        },
        learningCards: true
      }
    });
  }

  /**
   * Updates a LongTermLearning object in the database
   *
   * @param params.where Prisma where selector
   * @param params.data Prisma data selector
   *
   * @returns Updated `LongTermLearning` object
   */
  async updateLongTermLearning(params: {
    where: Prisma.LongTermLearningWhereUniqueInput;
    data: Prisma.LongTermLearningUpdateInput;
  }): Promise<PrismaLongTermLearning> {
    const { where, data } = params;
    return this.prisma.longTermLearning.update({
      data,
      where
    });
  }


  /**
   * Deletes a LongTermLearning object from the database
   *
   * @param where Prisma LongTermLearningWhereUniqueInput selector
   *
   * @returns `LongTermLearning` object that was deleted
   */
  async deleteLongTermLearning(where: Prisma.LongTermLearningWhereUniqueInput): Promise<PrismaLongTermLearning> {
    return this.prisma.longTermLearning.delete({
      where
    });
  }
}
