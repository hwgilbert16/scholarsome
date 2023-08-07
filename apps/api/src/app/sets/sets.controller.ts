import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards, UseInterceptors
} from "@nestjs/common";
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { SetsService } from "./sets.service";
import { UsersService } from "../users/users.service";
import { Request as ExpressRequest, Express } from "express";
import { ApiResponse, ApiResponseOptions } from "@scholarsome/shared";
import { Set } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
// needed for multer file type declaration
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { Multer } from "multer";
import * as crypto from "crypto";
import { CardsService } from "../cards/cards.service";
import { CardMedia } from "@prisma/client";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthorIdParam } from "./param/authorIdParam.param";
import { CreateSetFromApkgDto } from "./dto/createSetFromApkg.dto";
import { CreateSetDto } from "./dto/createSet.dto";
import { UpdateSetDto } from "./dto/updateSet.dto";
import { SetIdParam } from "./param/setIdParam.param";
import { SetOkResponse } from "./response/set.ok.response";

@ApiTags("Sets")
@Controller("sets")
export class SetsController {
  /**
   * @ignore
   */
  constructor(
    private readonly setsService: SetsService,
    private readonly usersService: UsersService,
    private readonly cardsService: CardsService
  ) {}

  /**
   * Gets a set given a set ID
   *
   * @returns `Set` object
   */
  @ApiOperation( {
    summary: "Get a set",
    description: "Gets a set given a set ID"
  })
  @Get(":setId")
  @ApiOkResponse({
    description: "Expected response to a valid request",
    type: SetOkResponse
  })
  async set(@Param() params: SetIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<Set>> {
    const set = await this.setsService.set({
      id: params.setId
    });
    if (!set) throw new NotFoundException();

    if (set.private) {
      const userCookie = this.usersService.getUserInfo(req);

      if (!userCookie) throw new NotFoundException();
      if (set.authorId !== userCookie.id) throw new UnauthorizedException();
    }

    return {
      status: ApiResponseOptions.Success,
      data: set
    };
  }

  /**
   * Gets the sets of a user given an author ID
   *
   * @returns Array of `Set` objects that belong to the user
   */
  @Get("/user/:authorId")
  async sets(@Param() params: AuthorIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<Set[]>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) {
      throw new NotFoundException();
    }

    if (params.authorId === "self") {
      return {
        status: ApiResponseOptions.Success,
        data: await this.setsService.sets({
          where: {
            authorId: user.id
          }
        })
      };
    }

    if (params.authorId === user.id) {
      return {
        status: ApiResponseOptions.Success,
        data: await this.setsService.sets({
          where: {
            authorId: params.authorId
          }
        })
      };
    } else {
      let sets = await this.setsService.sets({
        where: {
          authorId: params.authorId
        }
      });

      for (const set of sets) {
        if (set.private) {
          sets = sets.filter((s) => s.id !== set.id);
        }
      }

      return {
        status: ApiResponseOptions.Success,
        data: sets
      };
    }
  }

  /**
   * Creates a set from an Anki .apkg file
   *
   * @returns Created `Set` object
   */
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Post("apkg")
  async createSetFromApkg(@Body() body: CreateSetFromApkgDto, @Request() req: ExpressRequest, @UploadedFile() file: Express.Multer.File): Promise<ApiResponse<Set>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new NotFoundException();

    const author = await this.usersService.user({
      email: user.email
    });
    if (!author) throw new NotFoundException();

    const uuid = crypto.randomUUID();

    const decoded = await this.setsService.decodeAnkiApkg(file.buffer, uuid);
    if (!decoded) throw new UnsupportedMediaTypeException();

    const create = await this.setsService.createSet({
      id: uuid,
      author: {
        connect: {
          email: author.email
        }
      },
      title: body.title,
      description: body.description,
      private: body.private === "true",
      cards: {
        createMany: {
          data: decoded.cards.map((c) => {
            return {
              index: c.index,
              term: c.term,
              definition: c.definition
            };
          })
        }
      }
    });

    for (const media of decoded.media) {
      const card = create.cards.find((c) => c.term.includes(media) || c.definition.includes(media));
      if (!card) continue;

      await this.cardsService.createCardMedia({
        card: {
          connect: {
            id: card.id
          }
        },
        name: media
      });
    }

    return {
      status: ApiResponseOptions.Success,
      data: create
    };
  }

  /**
   * Creates a set
   *
   * @returns Created `Set` object
   */
  @UseGuards(AuthenticatedGuard)
  @Post()
  async createSet(@Body() body: CreateSetDto, @Request() req: ExpressRequest): Promise<ApiResponse<Set>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new NotFoundException();

    const author = await this.usersService.user({
      email: user.email
    });
    if (!author) throw new NotFoundException();

    const uuid = crypto.randomUUID();
    const media: string[] = [];

    for (const [i, card] of body.cards.entries()) {
      const scannedTerm = await this.cardsService.scanAndUploadMedia(card.term, uuid);
      if (scannedTerm) {
        body.cards[i].term = scannedTerm.scanned;
        media.push(...scannedTerm.media);
      }

      const scannedDefinition = await this.cardsService.scanAndUploadMedia(card.definition, uuid);
      if (scannedDefinition) {
        body.cards[i].definition = scannedDefinition.scanned;
        media.push(...scannedDefinition.media);
      }
    }

    const create = await this.setsService.createSet({
      id: uuid,
      author: {
        connect: {
          email: author.email
        }
      },
      title: body.title,
      description: body.description,
      private: body.private,
      cards: {
        createMany: {
          data: body.cards.map((c) => {
            return {
              index: c.index,
              term: c.term,
              definition: c.definition
            };
          })
        }
      }
    });

    for (const file of media) {
      const card = create.cards.find((c) => c.term.includes(file) || c.definition.includes(file));
      if (!card) continue;

      await this.cardsService.createCardMedia({
        card: {
          connect: {
            id: card.id
          }
        },
        name: file
      });
    }

    return {
      status: ApiResponseOptions.Success,
      data: create
    };
  }

  /**
   * Updates a set
   *
   * @returns Updated `Set` object
   */
  @UseGuards(AuthenticatedGuard)
  @Put(":setId")
  async updateSet(@Param() params: SetIdParam, @Body() body: UpdateSetDto, @Request() req: ExpressRequest): Promise<ApiResponse<Set>> {
    const set = await this.setsService.set({
      id: params.setId
    });
    if (!set) throw new NotFoundException();

    if (!(await this.setsService.verifySetOwnership(req, params.setId))) throw new UnauthorizedException();

    const newMedia: string[] = [];
    const existingMedias: CardMedia[] = [];

    if (body.cards) {
      // need to get the cards here before any are modified in the queries below
      const existingCards = await this.cardsService.cards({ where: { setId: set.id } });

      for (const [i, card] of body.cards.entries()) {
        const completeCard = await this.cardsService.card({ id: card.id });
        if (completeCard) {
          // for when media is deleted using the text editor
          // remove the associated files
          for (const mediaFile of completeCard.media) {
            existingMedias.push(mediaFile);
            if (!card.term.includes(mediaFile.name) && !card.definition.includes(mediaFile.name)) {
              await this.cardsService.deleteCardMedia({ id: mediaFile.id });
              await this.cardsService.deleteMedia(set.id, mediaFile.name);
            }
          }
        }

        const scannedTerm = await this.cardsService.scanAndUploadMedia(card.term, set.id);
        if (scannedTerm) {
          body.cards[i].term = scannedTerm.scanned;
          newMedia.push(...scannedTerm.media);
        }

        const scannedDefinition = await this.cardsService.scanAndUploadMedia(card.definition, set.id);
        if (scannedDefinition) {
          body.cards[i].definition = scannedDefinition.scanned;
          newMedia.push(...scannedDefinition.media);
        }
      }

      // remove all the cards linked to the set
      // as we will be recreating them all
      await this.setsService.updateSet({
        where: {
          id: set.id
        },
        data: {
          cards: {
            deleteMany: {
              setId: params.setId
            }
          }
        }
      });

      // for cards that have been entirely deleted
      // remove any media files they have attached to them
      for (const card of existingCards) {
        if (card && card.media && card.media.length > 0) {
          for (const mediaFile of card.media) {
            if (
              !body.cards.find((c) => c.term.includes(mediaFile.name) || c.definition.includes(mediaFile.name)
              )
            ) {
              await this.cardsService.deleteMedia(set.id, mediaFile.name);
            }
          }
        }
      }
    }

    const update = await this.setsService.updateSet({
      where: {
        id: set.id
      },
      data: {
        title: body.title,
        description: body.description,
        private: body.private,
        cards: body.cards ? {
          createMany: {
            data: body.cards.map((c) => {
              return {
                index: c.index,
                term: c.term,
                definition: c.definition
              };
            })
          }
        } : undefined
      }
    });

    // create media entries for new media
    for (const file of newMedia) {
      const card = update.cards.find((c) => c.term.includes(file) || c.definition.includes(file));
      if (!card) continue;

      await this.cardsService.createCardMedia({
        card: {
          connect: {
            id: card.id
          }
        },
        name: file
      });
    }

    // recreate media entries for existing media
    for (const file of existingMedias) {
      const card = update.cards.find((c) => c.term.includes(file.name) || c.definition.includes(file.name));
      if (!card) continue;

      await this.cardsService.createCardMedia({
        card: {
          connect: {
            id: card.id
          }
        },
        name: file.name
      });
    }

    return {
      status: ApiResponseOptions.Success,
      data: update
    };
  }

  /**
   * Deletes a set
   *
   * @returns Deleted `Set` Object
   */
  @UseGuards(AuthenticatedGuard)
  @Delete(":setId")
  async deleteSet(@Param() params: SetIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<Set>> {
    if (!(await this.setsService.verifySetOwnership(req, params.setId))) throw new UnauthorizedException();
    if (!params.setId) throw new NotFoundException();

    await this.setsService.deleteSetMediaFiles(params.setId);

    return {
      status: ApiResponseOptions.Success,
      data: await this.setsService.deleteSet({
        id: params.setId
      })
    };
  }
}
