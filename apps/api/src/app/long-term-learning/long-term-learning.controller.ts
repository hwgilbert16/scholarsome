import { Controller, NotFoundException, Param, Post, Request, UnauthorizedException } from "@nestjs/common";
import { LongTermLearningService } from "./long-term-learning.service";
import { Request as ExpressRequest } from "express";
import { UsersService } from "../users/users.service";
import { SetIdParam } from "./param/setIdParam.param";
import { SetsService } from "../sets/sets.service";
import { ApiResponse, ApiResponseOptions } from "@scholarsome/shared";
import { LongTermLearning as PrismaLongTermLearning } from "@prisma/client";

@Controller("long-term-learning")
export class LongTermLearningController {
  /**
   * @ignore
   */
  constructor(
    private readonly longTermLearningService: LongTermLearningService,
    private readonly usersService: UsersService,
    private readonly setsService: SetsService
  ) {}

  @Post(":setId")
  async createLongTermLearning(@Param() params: SetIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<PrismaLongTermLearning>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const set = await this.setsService.set({ id: params.setId });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    if (set.private && user.id !== set.authorId) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    return {
      status: ApiResponseOptions.Success,
      data: await this.longTermLearningService.createLongTermLearning({
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
        learningCards: {
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
