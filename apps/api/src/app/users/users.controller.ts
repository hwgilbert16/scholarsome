import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserIdParam } from "./dto/userIdParam";
import { UsersService } from "../providers/database/users/users.service";

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':userId')
  async user(@Param() params: UserIdParam) {
    const user = await this.usersService.user({
      id: params.userId
    });
    if (!user) throw new NotFoundException();

    return user;
  }
}
