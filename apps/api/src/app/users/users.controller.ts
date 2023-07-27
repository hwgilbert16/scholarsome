import { Controller, Get, NotFoundException, Param, Req } from "@nestjs/common";
import { ApiResponse, ApiResponseOptions, UserIdParam } from "@scholarsome/shared";
import { UsersService } from "./users.service";
import { Request as ExpressRequest } from "express";
import { User } from "@prisma/client";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Gets a user given a user ID
   *
   * @returns `User` object
   */
  @Get(":userId")
  async user(@Param() params: UserIdParam, @Req() req: ExpressRequest): Promise<ApiResponse<User>> {
    const cookies = this.usersService.getUserInfo(req);

    if (params.userId === "self") {
      if (!cookies) {
        throw new NotFoundException();
      }

      return {
        status: ApiResponseOptions.Success,
        data: await this.usersService.user({
          id: cookies.id
        })
      };
    }

    const user = await this.usersService.user({
      id: params.userId
    });
    if (!user) throw new NotFoundException();

    for (let i = 0; i < user.sets.length; i++) {
      if (cookies) {
        if (user.sets[i].private && user.sets[i].authorId !== cookies.id) {
          user.sets = user.sets.splice(i, i + 1);
        }
      } else {
        user.sets = user.sets.filter((set) => set.private === false);
      }
    }

    return {
      status: ApiResponseOptions.Success,
      data: user
    };
  }
}
