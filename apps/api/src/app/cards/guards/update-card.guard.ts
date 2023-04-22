import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { CardIdParam, UpdateCardDto } from "@scholarsome/shared";
import { UsersService } from "../../users/users.service";
import { SetsService } from "../../sets/sets.service";
import { CardsService } from "../cards.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request } from "express";

@Injectable()
export class UpdateCardGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private setsService: SetsService,
    private cardsService: CardsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    // guards are executed before pipes -> we have to manually validate body
    if ((await validate(plainToInstance(UpdateCardDto, req.body))).length > 0) throw new BadRequestException();
    if ((await validate(plainToInstance(CardIdParam, req.params))).length > 0) throw new BadRequestException();

    const card = await this.cardsService.card({
      id: req.params.cardId
    });
    if (!card) throw new NotFoundException();

    if (!(await this.setsService.verifySetOwnership(req, card.setId))) throw new UnauthorizedException();

    return true;
  }
}
