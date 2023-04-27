import {
  BadRequestException,
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { SetsService } from "../../sets/sets.service";
import { CreateCardDto } from "@scholarsome/shared";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

@Injectable()
export class CreateCardGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly setsService: SetsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const body: CreateCardDto = context.switchToHttp().getRequest().body;

    // guards are executed before pipes -> we have to manually validate body
    if ((await validate(plainToClass(CreateCardDto, body))).length > 0) throw new BadRequestException();

    const user = this.usersService.getUserInfo(context.switchToHttp().getRequest());
    if (!user) throw new NotFoundException();

    const set = await this.setsService.set({ id: body.setId });

    if (!set || set.authorId !== user.id) throw new UnauthorizedException();

    for (const card of set.cards) {
      if (card.index === body.index) throw new ConflictException();
    }
    return true;
  }
}
