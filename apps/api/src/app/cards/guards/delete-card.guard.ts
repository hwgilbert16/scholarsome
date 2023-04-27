import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { request } from "express";
import { CardsService } from "../cards.service";
import { SetsService } from "../../sets/sets.service";
import { CardIdParam } from "@scholarsome/shared";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class DeleteCardGuard implements CanActivate {
  constructor(
    private readonly cardsService: CardsService,
    private readonly setsService: SetsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const param: CardIdParam = context.switchToHttp().getRequest().params;

    // guards are executed before pipes -> we have to manually validate body
    if ((await validate(plainToClass(CardIdParam, param))).length > 0) throw new BadRequestException();

    const card = await this.cardsService.card({
      id: param.cardId
    });
    if (!card) throw new NotFoundException();

    if (!(await this.setsService.verifySetOwnership(request, card.setId))) throw new UnauthorizedException();

    return true;
  }
}
