import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
  Request,
  Post,
  UseGuards,
  Body,
  Put,
  Delete
} from "@nestjs/common";
import { Request as ExpressRequest } from "express";
import { CardsService } from "./cards.service";
import { UsersService } from "../users/users.service";
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { SetsService } from "../sets/sets.service";
import { CardIdParam, CreateCardDto, UpdateCardDto } from "@scholarsome/shared";
import { CreateCardGuard } from "./guards/create-card.guard";
import { DeleteCardGuard } from "./guards/delete-card.guard";
import { UpdateCardGuard } from "./guards/update-card.guard";

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

    let userId = "";

    if (
      userCookie &&
      await this.usersService.user({
        id: userCookie.id
      })
    ) {
      userId = (await this.usersService.user({
        id: userCookie.id
      })).id;
    }

    const card = await this.cardsService.card({
      id: params.cardId
    });

    if (!card) throw new NotFoundException();
    if (card.set.private && (card.set.authorId !== userId)) throw new UnauthorizedException();

    return card;
  }

  /**
   * Creates a card
   *
   * @returns Created `Card` object
   */
  @UseGuards(AuthenticatedGuard, CreateCardGuard)
  @Post()
  async createCard(@Body() body: CreateCardDto) {
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
  @UseGuards(AuthenticatedGuard, UpdateCardGuard)
  @Put(":cardId")
  async updateCard(@Param() params: CardIdParam, @Body() body: UpdateCardDto) {
    return await this.cardsService.updateCard({
      where: {
        id: params.cardId
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
  @UseGuards(AuthenticatedGuard, DeleteCardGuard)
  @Delete(":cardId")
  async deleteCard(@Param() params: CardIdParam) {
    return await this.cardsService.deleteCard({
      id: params.cardId
    });
  }
}
