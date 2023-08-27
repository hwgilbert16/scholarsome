import { Controller, Get, NotFoundException, Param, Post, Request, UnauthorizedException } from "@nestjs/common";
import { LeitnerSetsService } from "./leitner-sets.service";
import { Request as ExpressRequest } from "express";
import { UsersService } from "../users/users.service";
import { SetIdParam } from "./param/setIdParam.param";
import { SetsService } from "../sets/sets.service";
import { ApiResponse, ApiResponseOptions } from "@scholarsome/shared";
import { LeitnerSet as PrismaLeitnerSet } from "@prisma/client";

@Controller("leitner-sets")
export class LeitnerSetsController {
  /**
   * @ignore
   */
  constructor(
    private readonly leitnerSetsService: LeitnerSetsService,
    private readonly usersService: UsersService,
    private readonly setsService: SetsService
  ) {}

  @Get(":setId")
  async getLeitnerSet(@Param() params: SetIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<PrismaLeitnerSet | []>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const set = await this.setsService.set({ id: params.setId });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    const leitnerSets = await this.leitnerSetsService.leitnerSets({
      where: {
        userId: user.id,
        setId: set.id
      }
    });

    return {
      status: ApiResponseOptions.Success,
      data: leitnerSets[0] ? leitnerSets[0] : null
    };
  }

  @Post(":setId")
  async createLeitnerSet(@Param() params: SetIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<PrismaLeitnerSet>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const set = await this.setsService.set({ id: params.setId });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    if (set.private && user.id !== set.authorId) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    return {
      status: ApiResponseOptions.Success,
      data: await this.leitnerSetsService.createLeitnerSet({
        set: {
          connect: {
            id: set.id
          }
        },
        user: {
          connect: {
            id: user.id
          }
        },
        leitnerCards: {
          createMany: {
            data: set.cards.map((c) => {
              return {
                index: c.index,
                term: c.term,
                definition: c.definition
              };
            })
          }
        }
      })
    };
  }
}
