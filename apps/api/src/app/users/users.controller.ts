import { Controller, Get, NotFoundException, Param, Req } from "@nestjs/common";
import { ApiResponse, ApiResponseOptions } from "@scholarsome/shared";
import { UsersService } from "./users.service";
import { Request as ExpressRequest } from "express";
import { User } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";
import { UserIdParam } from "./param/userId.param";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Gets the current authenticated user
   *
   * @returns `User` object
   */
  @Get("me")
  async myUser(@Req() req: ExpressRequest): Promise<ApiResponse<User>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new NotFoundException();

    return {
      status: ApiResponseOptions.Success,
      data: await this.usersService.user({
        id: user.id
      })
    };
  }

  /**
   * Gets a user given a user ID
   *
   * @returns `User` object
   */
  @Get(":userId")
  async user(@Param() params: UserIdParam, @Req() req: ExpressRequest): Promise<ApiResponse<User>> {
    const cookies = this.usersService.getUserInfo(req);

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
