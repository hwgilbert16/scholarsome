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
  UnauthorizedException, UnsupportedMediaTypeException, UploadedFile,
  UseGuards, UseInterceptors
} from "@nestjs/common";
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { SetsService } from "./sets.service";
import { UsersService } from "../users/users.service";
import { Request as ExpressRequest, Express } from "express";
import {
  ApiResponse,
  AuthorIdParam,
  CreateSetDto,
  CreateSetFromApkgDto,
  SetIdParam,
  UpdateSetDto
} from "@scholarsome/shared";
import { Set } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
// needed for multer file type declaration
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { Multer } from "multer";
import * as crypto from "crypto";
import { CardsService } from "../cards/cards.service";

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
  @Get(":setId")
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
      status: "success",
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
        status: "success",
        data: await this.setsService.sets({
          where: {
            authorId: user.id
          }
        })
      };
    }

    if (params.authorId === user.id) {
      return {
        status: "success",
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
        status: "success",
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
      await this.setsService.createSetMedia({
        set: {
          connect: {
            id: create.id
          }
        },
        name: media
      });
    }

    return {
      status: "success",
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

    for (const [i, card] of body.cards.entries()) {
      const scannedTerm = await this.cardsService.scanAndUploadMedia(card.term, uuid);
      if (scannedTerm) body.cards[i].term = scannedTerm;

      const scannedDefinition = await this.cardsService.scanAndUploadMedia(card.definition, uuid);
      if (scannedDefinition) body.cards[i].definition = scannedDefinition;
    }

    return {
      status: "success",
      data: await this.setsService.createSet({
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
      })
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

    // we are overwriting the cards, entire new array is provided
    if (body.cards) {
      for (const [i, card] of body.cards.entries()) {
        const scannedTerm = await this.cardsService.scanAndUploadMedia(card.term, set.id);
        if (scannedTerm) body.cards[i].term = scannedTerm;

        const scannedDefinition = await this.cardsService.scanAndUploadMedia(card.definition, set.id);
        if (scannedDefinition) body.cards[i].definition = scannedDefinition;
      }

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
    }

    return {
      status: "success",
      data: await this.setsService.updateSet({
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
      })
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

    await this.setsService.deleteSetMediaFiles(params.setId);

    return {
      status: "success",
      data: await this.setsService.deleteSet({
        id: params.setId
      })
    };
  }
}
