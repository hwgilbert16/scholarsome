import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Request,
  Post,
  UseGuards,
  Body,
  Delete,
  UnauthorizedException,
  Patch
} from "@nestjs/common";
import { Request as ExpressRequest } from "express";
import { CardsService } from "./cards.service";
import { UsersService } from "../users/users.service";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { SetsService } from "../sets/sets.service";
import { ApiResponse, ApiResponseOptions } from "@scholarsome/shared";
import { CreateCardGuard } from "./guards/create-card.guard";
import { DeleteCardGuard } from "./guards/delete-card.guard";
import { UpdateCardGuard } from "./guards/update-card.guard";
import { Card } from "@prisma/client";
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { CardIdParam } from "./param/cardId.param";
import { CreateCardDto } from "./dto/createCard.dto";
import { UpdateCardDto } from "./dto/updateCard.dto";
import { CardSuccessResponse } from "./response/success/card.success.response";
import { ErrorResponse } from "../shared/response/error.response";
import { AuthService } from "../auth/auth.service";

@ApiTags("Cards")
@Controller("cards")
export class CardsController {
  /**
   * @ignore
   */
  constructor(
    private readonly cardsService: CardsService,
    private readonly setsService: SetsService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  /**
   * Gets a card given a card ID
   *
   * @returns `Card` object
   */
  @ApiOperation({
    summary: "Get a card"
  })
  @ApiOkResponse({
    description: "Expected response to a valid request",
    type: CardSuccessResponse
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Get(":cardId")
  async card(@Param() params: CardIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<Card>> {
    const userCookie = await this.authService.getUserInfo(req);

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

    if (!card) {
      throw new NotFoundException({ status: "fail", message: "Card not found" });
    }

    if (card.set.private && (card.set.authorId !== userId)) {
      throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    return {
      status: ApiResponseOptions.Success,
      data: card
    };
  }

  /**
   * Creates a card
   *
   * @returns Created `Card` object
   */
  @UseGuards(AuthenticatedGuard, CreateCardGuard)
  @ApiOperation({
    summary: "Create a card"
  })
  @ApiCreatedResponse({
    description: "Expected response to a valid request",
    type: CardSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Post()
  async createCard(@Body() body: CreateCardDto, @Request() req: ExpressRequest): Promise<ApiResponse<Card>> {
    if (!(await this.setsService.verifySetOwnership(req, body.setId))) {
      throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    const set = await this.setsService.set({ id: body.setId });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    let index = body.index;
    const indices = set.cards.map((c) => c.index)
        .sort((a, b) => a - b);

    if (indices.includes(body.index)) {
      // if the index already exists
      await this.setsService.shiftCardIndices(set.id, body.index, 1);

      index = body.index;
    } else if (body.index > indices[indices.length - 1] + 1) {
      // if the provided index is greater than +1 of the existing highest index
      index = indices[indices.length - 1] + 1;
    } else if (!body.index) {
      // if no provided index
      // index is +1 of the index of the last card in the set
      index = indices[indices.length - 1] + 1;
    }

    let media = [];

    const termScanned = await this.cardsService.scanAndUploadMedia(body.term, body.setId);
    if (termScanned) {
      body.term = termScanned.scanned;
      media = [...termScanned.media];
    }

    const definitionScanned = await this.cardsService.scanAndUploadMedia(body.definition, body.setId);
    if (definitionScanned) {
      body.definition = definitionScanned.scanned;
      media = [...media, ...definitionScanned.media];
    }

    return {
      status: ApiResponseOptions.Success,
      data: await this.cardsService.createCard({
        index: index,
        term: body.term,
        definition: body.definition,
        media: {
          createMany: {
            data: media.map((c) => {
              return {
                name: c
              };
            })
          }
        },
        set: {
          connect: {
            id: body.setId
          }
        }
      })
    };
  }

  /**
   * Updates a card
   *
   * @returns Updated `Card` object
   */
  @UseGuards(AuthenticatedGuard, UpdateCardGuard)
  @ApiOperation({
    summary: "Update a card"
  })
  @ApiOkResponse({
    description: "Expected response to a valid request",
    type: CardSuccessResponse
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Patch(":cardId")
  async updateCard(@Param() params: CardIdParam, @Body() body: UpdateCardDto, @Request() req: ExpressRequest): Promise<ApiResponse<Card>> {
    const card = await this.cardsService.card({ id: params.cardId });
    if (!card) {
      throw new NotFoundException({ status: "fail", message: "Card not found" });
    }

    if (!(await this.setsService.verifySetOwnership(req, card.setId))) {
      throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    let media = [];

    // there's likely a better way to write the media deletion checking
    // but for now the implementation here is sufficient
    let mediaChecked = false;

    if (body.term) {
      const termScanned = await this.cardsService.scanAndUploadMedia(body.term, card.setId);
      if (termScanned) {
        body.term = termScanned.scanned;
        media = [...termScanned.media];
      }

      for (const media of card.media) {
        mediaChecked = true;

        if (!body.definition && !body.term.includes(media.name)) {
          await this.cardsService.deleteMedia(card.setId, media.name);
        } else if (
          body.definition &&
          !body.definition.includes(media.name) &&
          !body.term.includes(media.name)
        ) {
          await this.cardsService.deleteMedia(card.setId, media.name);
        }
      }
    }

    if (body.definition) {
      const definitionScanned = await this.cardsService.scanAndUploadMedia(body.definition, card.setId);
      if (definitionScanned) {
        body.definition = definitionScanned.scanned;
        media = [...media, ...definitionScanned.media];
      }

      if (!mediaChecked) {
        for (const media of card.media) {
          if (!body.definition.includes(media.name)) {
            await this.cardsService.deleteMedia(card.setId, media.name);
          }
        }
      }
    }

    return {
      status: ApiResponseOptions.Success,
      data: await this.cardsService.updateCard({
        where: {
          id: params.cardId
        },
        data: {
          index: body.index,
          term: body.term,
          definition: body.definition,
          media: {
            createMany: {
              data: media.map((c) => {
                return {
                  name: c
                };
              })
            }
          }
        }
      })
    };
  }

  /**
   * Deletes a card
   *
   * @returns Deleted `Card` object
   */
  @UseGuards(AuthenticatedGuard, DeleteCardGuard)
  @ApiOperation({
    summary: "Delete a card"
  })
  @ApiOkResponse({
    description: "Expected response to a valid request",
    type: CardSuccessResponse
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Delete(":cardId")
  async deleteCard(@Param() params: CardIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<Card>> {
    const userCookie = await this.authService.getUserInfo(req);
    if (!userCookie) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const card = await this.cardsService.card({ id: params.cardId });
    if (!card) throw new NotFoundException({ status: "fail", message: "Card not found" });

    if (card.set.authorId !== userCookie.id) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    return {
      status: ApiResponseOptions.Success,
      data: await this.cardsService.deleteCard({
        id: params.cardId
      })
    };
  }
}
