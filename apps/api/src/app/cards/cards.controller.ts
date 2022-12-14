import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
  Request,
  Post,
  UseGuards,
  Body,
  ConflictException,
  Put,
  Delete
} from '@nestjs/common';
import { CardIdParam } from "./dto/cardIdParam";
import { Request as ExpressRequest } from 'express';
import { CardsService } from "../providers/database/cards/cards.service";
import { UsersService } from "../providers/database/users/users.service";
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { CreateCardBody } from "./dto/createCardBody.dto";
import { SetsService } from "../providers/database/sets/sets.service";
import { UpdateCardBody } from "./dto/updateCardBody.dto";

@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService, private setsService: SetsService, private usersService: UsersService) {}

  @Get(':cardId')
  async card(@Param() params: CardIdParam, @Request() req: ExpressRequest) {
    const userCookie = this.usersService.getUserInfo(req);
    if (!userCookie) {
      throw new NotFoundException();
    }

    const user = await this.usersService.user({
      id: userCookie.id
    });
    if (!user) throw new BadRequestException();

    const card = await this.cardsService.card({
      id: params.cardId
    });

    if (card.set.private && (card.set.authorId !== userCookie.id)) throw new UnauthorizedException();
    if (!card) throw new NotFoundException();

    return card;
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  async createCard(@Body() body: CreateCardBody, @Request() req: ExpressRequest) {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new NotFoundException();

    const set = await this.setsService.set({
      id: body.setId
    });
    if (!set || set.authorId !== user.id) throw new UnauthorizedException();

    for (const card of set.cards) {
      if (card.index === body.index) throw new ConflictException();
    }

    return await this.cardsService.createCard({
      index: body.index,
      term: body.term,
      definition: body.definition,
      set: {
        connect: {
          id: body.setId
        }
      }
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Put(':cardId')
  async updateCard(@Param() params: CardIdParam, @Body() body: UpdateCardBody, @Request() req: ExpressRequest) {
    const card = await this.cardsService.card({
      id: params.cardId
    });
    if (!card) throw new NotFoundException();

    if (!(await this.setsService.verifySetOwnership(req, card.setId))) throw new UnauthorizedException();

    return await this.cardsService.updateCard({
      where: {
        id: card.id
      },
      data: {
        index: body.index,
        term: body.term,
        definition: body.definition
      }
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':cardId')
  async deleteCard(@Param() params: CardIdParam, @Request() req: ExpressRequest) {
    const card = await this.cardsService.card({
      id: params.cardId
    });
    if (!card) throw new NotFoundException();

    if (!(await this.setsService.verifySetOwnership(req, card.setId))) throw new UnauthorizedException();

    return await this.cardsService.deleteCard({
      id: params.cardId
    });
  }
}
