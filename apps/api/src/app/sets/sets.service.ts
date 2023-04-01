import { Injectable } from '@nestjs/common';
import { PrismaService } from "../providers/database/prisma/prisma.service";
import { Prisma, Set as PrismaSet } from "@prisma/client";
import { Set } from "@scholarsome/shared";
import { Request as ExpressRequest } from "express";
import jwt_decode from "jwt-decode";
import { UsersService } from "../users/users.service";

@Injectable()
export class SetsService {
  constructor(private prisma: PrismaService, private usersService: UsersService) {}

  public async verifySetOwnership(req: ExpressRequest, setId: string): Promise<boolean> {
    let accessToken: { id: string; email: string; };

    if (req.cookies['access_token']) {
      accessToken = jwt_decode(req.cookies['access_token']) as { id: string; email: string; };
    } else {
      return false;
    }

    const user = await this.usersService.user({
      id: accessToken.id
    });

    const set = await this.set({
      id: setId
    });

    if (!set || !user) return false;

    return set.author.id === user.id;
  }

  async set(
    setWhereUniqueInput: Prisma.SetWhereUniqueInput
  ): Promise<Set | null> {
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
  }): Promise<Set[]> {
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

  async createSet(data: Prisma.SetCreateInput): Promise<PrismaSet> {
    return this.prisma.set.create({
      data
    });
  }

  async updateSet(params: {
    where: Prisma.SetWhereUniqueInput;
    data: Prisma.SetUpdateInput;
  }): Promise<PrismaSet> {
    const { where, data } = params;
    return this.prisma.set.update({
      data,
      where
    });
  }

  async deleteSet(where: Prisma.SetWhereUniqueInput): Promise<PrismaSet> {
    return this.prisma.set.delete({
      where
    });
  }
}
