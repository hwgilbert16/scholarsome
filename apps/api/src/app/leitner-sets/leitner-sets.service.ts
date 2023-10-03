import { Injectable } from "@nestjs/common";
import { Prisma, LeitnerSet as PrismaLeitnerSet } from "@prisma/client";
import { PrismaService } from "../providers/database/prisma/prisma.service";
import { LeitnerSet } from "@scholarsome/shared";

@Injectable()
export class LeitnerSetsService {
  /**
   * @ignore
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Queries the database for a unique LeitnerSet object
   *
   * @param leitnerSetWhereUniqueInput Prisma `LeitnerSetWhereUniqueInput` selector object
   *
   * @returns Queried `LeitnerSet` object
   */
  async leitnerSet(
      leitnerSetWhereUniqueInput: Prisma.LeitnerSetWhereUniqueInput
  ): Promise<LeitnerSet | null> {
    return this.prisma.leitnerSet.findUnique({
      where: leitnerSetWhereUniqueInput,
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
        leitnerCards: {
          select: {
            card: true,
            cardId: true,
            box: true,
            due: true
          }
        },
        studySession: {
          select: {
            id: true,
            startedAt: true,
            learnedCards: {
              select: {
                leitnerCard: {
                  select: {
                    cardId: true,
                    card: true,
                    box: true,
                    due: true
                  }
                }
              }
            },
            unlearnedCards: {
              select: {
                leitnerCard: {
                  select: {
                    cardId: true,
                    card: true,
                    box: true,
                    due: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }


  /**
   * Queries the database for multiple LeitnerSet objects
   *
   * @param params.skip Optional, Prisma skip selector
   * @param params.take Optional, Prisma take selector
   * @param params.cursor Optional, Prisma cursor selector
   * @param params.where Optional, Prisma where selector
   * @param params.orderBy Optional, Prisma orderBy selector
   *
   * @returns Array of queried `LeitnerSet` objects
   */
  async leitnerSets(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LeitnerSetWhereUniqueInput;
    where?: Prisma.LeitnerSetWhereInput;
    orderBy?: Prisma.LeitnerSetOrderByWithRelationInput;
  }): Promise<LeitnerSet[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.leitnerSet.findMany({
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
        leitnerCards: {
          select: {
            card: true,
            cardId: true,
            box: true,
            due: true
          }
        },
        studySession: {
          select: {
            id: true,
            startedAt: true,
            learnedCards: {
              select: {
                leitnerCard: {
                  select: {
                    cardId: true,
                    card: true,
                    box: true,
                    due: true
                  }
                }
              }
            },
            unlearnedCards: {
              select: {
                leitnerCard: {
                  select: {
                    cardId: true,
                    card: true,
                    box: true,
                    due: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * Creates a LeitnerSet object in the database
   *
   * @param data Prisma `LeitnerSetCreateInput` selector
   *
   * @returns Created `LeitnerSet` object
   */
  async createLeitnerSet(data: Prisma.LeitnerSetCreateInput): Promise<PrismaLeitnerSet> {
    return this.prisma.leitnerSet.create({
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
        leitnerCards: true
      }
    });
  }

  /**
   * Updates a LeitnerSet object in the database
   *
   * @param params.where Prisma where selector
   * @param params.data Prisma data selector
   *
   * @returns Updated `LeitnerSet` object
   */
  async updateLeitnerSet(params: {
    where: Prisma.LeitnerSetWhereUniqueInput;
    data: Prisma.LeitnerSetUpdateInput;
  }): Promise<PrismaLeitnerSet> {
    const { where, data } = params;
    return this.prisma.leitnerSet.update({
      data,
      where
    });
  }


  /**
   * Deletes a LeitnerSet object from the database
   *
   * @param where Prisma LeitnerSetWhereUniqueInput selector
   *
   * @returns `LeitnerSet` object that was deleted
   */
  async deleteLeitnerSet(where: Prisma.LeitnerSetWhereUniqueInput): Promise<PrismaLeitnerSet> {
    return this.prisma.leitnerSet.delete({
      where
    });
  }
}
