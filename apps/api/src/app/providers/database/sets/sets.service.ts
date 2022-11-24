import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { Prisma, Set } from "@prisma/client";
import { SetWithRelations } from "@scholarsome/api-interfaces";

@Injectable()
export class SetsService {
  constructor(private prisma: PrismaService) {}

  async set(
    setWhereUniqueInput: Prisma.SetWhereUniqueInput
  ): Promise<SetWithRelations | null> {
    return this.prisma.set.findUnique({
      where: setWhereUniqueInput,
      include: { cards: true, author: true }
    });
  }

  async sets(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SetWhereUniqueInput;
    where?: Prisma.SetWhereInput;
    orderBy?: Prisma.SetOrderByWithRelationInput;
  }): Promise<SetWithRelations[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.set.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        cards: true,
        author: true
      }
    });
  }

  async createSet(data: Prisma.SetCreateInput): Promise<Set> {
    return this.prisma.set.create({
      data
    });
  }

  async updateSet(params: {
    where: Prisma.SetWhereUniqueInput;
    data: Prisma.SetUpdateInput;
  }): Promise<Set> {
    const { where, data } = params;
    return this.prisma.set.update({
      data,
      where
    });
  }

  async deleteSet(where: Prisma.SetWhereUniqueInput): Promise<Set> {
    return this.prisma.set.delete({
      where
    });
  }
}
