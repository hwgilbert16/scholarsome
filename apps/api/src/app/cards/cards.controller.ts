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
} from "@nestjs/common";
import { Request as ExpressRequest } from "express";
import { CardsService } from "./cards.service";
import { UsersService } from "../users/users.service";
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { SetsService } from "../sets/sets.service";
import { CardIdParam, CreateCardDto, UpdateCardDto } from "@scholarsome/shared";

@Controller("cards")
export class CardsController {
  /**
   * @ignore
   */
  constructor(private cardsService: CardsService, private setsService: SetsService, private usersService: UsersService) {}

  /**
   * Gets a card given a card ID
   *
   * @returns `Card` object
   */
  @Get(":cardId")
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

  /**
   * Creates a card
   *
   * @returns Created `Card` object
   */
  @UseGuards(AuthenticatedGuard)
  @Post()
  async createCard(@Body() body: CreateCardDto, @Request() req: ExpressRequest) {
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

  /**
   * Updates a card
   *
   * @returns Updated `Card` object
   */
  @UseGuards(AuthenticatedGuard)
  @Put(":cardId")
  async updateCard(@Param() params: CardIdParam, @Body() body: UpdateCardDto, @Request() req: ExpressRequest) {
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

  /**
   * Deletes a card
   *
   * @returns Deleted `Card` object
   */
  @UseGuards(AuthenticatedGuard)
  @Delete(":cardId")
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
