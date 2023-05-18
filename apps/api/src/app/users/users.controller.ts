import { Controller, Get, NotFoundException, Param, Req } from "@nestjs/common";
import { ApiResponse, UserIdParam } from "@scholarsome/shared";
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
    if (params.userId === "self") {
      const cookies = this.usersService.getUserInfo(req);
      if (!cookies) {
        throw new NotFoundException();
      }

      return {
        status: "success",
        data: await this.usersService.user({
          id: cookies.id
        })
      };
    }

    const user = await this.usersService.user({
      id: params.userId
    });
    if (!user) throw new NotFoundException();

    return {
      status: "success",
      data: user
    };
  }
}
