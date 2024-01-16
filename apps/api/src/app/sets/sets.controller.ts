import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request, Response, StreamableFile,
  UnauthorizedException,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { SetsService } from "./sets.service";
import { UsersService } from "../users/users.service";
import { Request as ExpressRequest, Response as ExpressResponse, Express } from "express";
import { ApiResponse, ApiResponseOptions } from "@scholarsome/shared";
import { Set } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
// needed for multer file type declaration
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { Multer } from "multer";
import * as crypto from "crypto";
import { CardsService } from "../cards/cards.service";
import { CardMedia } from "@prisma/client";
import {
  ApiConsumes, ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse, ApiUnsupportedMediaTypeResponse
} from "@nestjs/swagger";
import { CreateSetFromFileDto } from "./dto/createSetFromFile.dto";
import { CreateSetDto } from "./dto/createSet.dto";
import { UpdateSetDto } from "./dto/updateSet.dto";
import { SetIdParam } from "./param/setIdParam.param";
import { UserIdParam } from "../users/param/userId.param";
import { SetsSuccessResponse } from "./response/success/sets.success.response";
import { SetSuccessResponse } from "./response/success/set.success.response";
import { ErrorResponse } from "../shared/response/error.response";
import { Throttle } from "@nestjs/throttler";
import { QuizletExportParams } from "./param/quizletExportParams";

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
   * Gets the sets of the authenticated user
   *
   * @returns Array of `Set` objects that belong to the authenticated user
   * @remarks This MUST be placed before the "user/:userId" route to ensure this is mapped
   */
  @ApiOperation({
    summary: "Get the sets of the authenticated user",
    description: "Gets all of the sets of the user that is currently authenticated"
  })
  @ApiOkResponse({
    description: "Expected response to a valid request",
    type: SetsSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Get("user/me")
  async mySets(@Request() req: ExpressRequest): Promise<ApiResponse<Set[]>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    return {
      status: ApiResponseOptions.Success,
      data: await this.setsService.sets({
        where: {
          authorId: user.id
        }
      })
    };
  }

  /**
   * Gets the sets of a user given an author ID
   *
   * @returns Array of `Set` objects that belong to the user
   */
  @ApiOperation({
    summary: "Get the sets of a user"
  })
  @ApiOkResponse({
    description: "Expected response to a valid request",
    type: SetsSuccessResponse
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse
  })
  @Get("user/:userId")
  async sets(@Request() req: ExpressRequest, @Param() params: UserIdParam): Promise<ApiResponse<Set[]>> {
    const user = this.usersService.getUserInfo(req);

    // if a user is requesting their own sets -> don't filter private sets
    if (user && params.userId === user.id) {
      return {
        status: ApiResponseOptions.Success,
        data: await this.setsService.sets({
          where: {
            authorId: params.userId
          }
        })
      };

    // a user is requesting a different user's sets -> filter private sets
    } else {
      const user = await this.usersService.user({
        id: params.userId
      });
      if (!user) {
        throw new NotFoundException({ status: "fail", message: "User not found" });
      }

      let sets = await this.setsService.sets({
        where: {
          authorId: params.userId
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
   * Gets a set given a set ID
   *
   * @returns `Set` object
   */
  @ApiOperation( {
    summary: "Get a set"
  })
  @ApiOkResponse({
    description: "Expected response to a valid request",
    type: SetSuccessResponse
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Get(":setId")
  async set(@Param() params: SetIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<Set>> {
    const set = await this.setsService.set({
      id: params.setId
    });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    if (set.private) {
      const userCookie = this.usersService.getUserInfo(req);

      if (!userCookie) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
      if (set.authorId !== userCookie.id) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    return {
      status: ApiResponseOptions.Success,
      data: set
    };
  }

  /**
   * Exports the media of a set in a .zip file
   *
   * @remarks Throttled to 1 request every 3 seconds
   */
  @Throttle(1, 3000)
  @ApiOperation( {
    summary: "Exports the media of a set in a .zip file",
    description: "Gets the media content of a set and packages it into a .zip file"
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Get("export/media/:setId")
  async exportSetMedia(@Param() params: SetIdParam, @Request() req: ExpressRequest, @Response({ passthrough: true }) res: ExpressResponse): Promise<StreamableFile> {
    const set = await this.setsService.set({
      id: params.setId
    });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    if (set.private) {
      const userCookie = this.usersService.getUserInfo(req);

      if (!userCookie) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
      if (set.authorId !== userCookie.id) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    const zip = await this.setsService.exportSetMedia(set.id);
    if (zip === false) throw new InternalServerErrorException();
    if (zip === null) throw new HttpException("No Content", HttpStatus.NO_CONTENT);

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${set.title + " Media.zip"}`
    });

    return new StreamableFile(zip);
  }

  /**
   * Converts a set to a .csv file
   *
   * @remarks Throttled to 1 request every 3 seconds
   */
  @Throttle(1, 3000)
  @ApiOperation( {
    summary: "Exports a set to a .csv file",
    description: "Converts a Scholarsome set to an Anki-compatible .apkg file. Includes media (images, videos, etc) with the exported .apkg file."
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Get("export/csv/:setId")
  async exportSetToCsv(@Param() params: SetIdParam, @Request() req: ExpressRequest, @Response({ passthrough: true }) res: ExpressResponse): Promise<StreamableFile> {
    const set = await this.setsService.set({
      id: params.setId
    });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    if (set.private) {
      const userCookie = this.usersService.getUserInfo(req);

      if (!userCookie) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
      if (set.authorId !== userCookie.id) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    const csv = this.setsService.exportAsCsv(set);
    if (!csv) throw new InternalServerErrorException("Error converting set to csv file");

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${set.title + ".csv"}`
    });

    return new StreamableFile(csv);
  }

  /**
   * Converts a set to an Anki-compatible .apkg file
   *
   * @remarks Throttled to 1 request every 3 seconds
   */
  @ApiOperation( {
    summary: "Exports a set to an Anki-compatible .apkg file",
    description: "Converts a Scholarsome set to an Anki-compatible .apkg file. Includes media (images, videos, etc) with the exported .apkg file."
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Throttle(1, 3000)
  @Get("export/anki/:setId")
  async exportSetToAnkiApkg(@Param() params: SetIdParam, @Request() req: ExpressRequest, @Response({ passthrough: true }) res: ExpressResponse): Promise<StreamableFile> {
    const set = await this.setsService.set({
      id: params.setId
    });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    if (set.private) {
      const userCookie = this.usersService.getUserInfo(req);

      if (!userCookie) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
      if (set.authorId !== userCookie.id) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    const apkg = await this.setsService.exportAsAnkiApkg(set);

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${set.title + ".apkg"}`
    });

    return new StreamableFile(apkg);
  }

  /**
   * Converts a set to a .txt file that can be imported into Quizlet
   *
   * @remarks Throttled to 1 request every 3 seconds
   */
  @ApiOperation( {
    summary: "Exports a set to a .txt that can be imported in Quizlet",
    description: "Converts a Scholarsome set to a .txt that can be imported in Quizlet. Media (images, videos, etc) will not be included in the exported .txt, as Quizlet does not provide an ability to import these materials."
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Throttle(1, 3000)
  @Get("export/quizlet/:setId/:sideDiscriminator/:cardDiscriminator")
  async exportSetToQuizletTxt(@Param() params: QuizletExportParams, @Request() req: ExpressRequest, @Response({ passthrough: true }) res: ExpressResponse): Promise<StreamableFile> {
    const set = await this.setsService.set({
      id: params.setId
    });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    if (set.private) {
      const userCookie = this.usersService.getUserInfo(req);

      if (!userCookie) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
      if (set.authorId !== userCookie.id) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
    }

    const txt = this.setsService.exportAsQuizletTxt(set, params.sideDiscriminator, params.cardDiscriminator);
    if (!txt) throw new BadRequestException("At least one card in the set contains side or card discriminator characters. The set must not contain the characters being used to format the exported set.");

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${set.title + ".txt"}`
    });

    return new StreamableFile(txt);
  }

  /**
   * Creates a set from an Anki .apkg file
   *
   * @returns Created `Set` object
   */
  @ApiOperation( {
    summary: "Imports a set from a .apkg file",
    description: "Converts a .apkg file to a Scholarsome set. Compatible only with simple front-back Anki sets, multiple fields currently unsupported."
  })
  @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    description: "Expected response to a valid request",
    type: SetSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @ApiUnsupportedMediaTypeResponse({
    description: "Uploaded file is not a properly formatted CSV",
    type: ErrorResponse
  })
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Post("csv")
  async importSetFromCsvFile(@Body() body: CreateSetFromFileDto, @Request() req: ExpressRequest, @UploadedFile() file: Express.Multer.File): Promise<ApiResponse<Set>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const author = await this.usersService.user({
      email: user.email
    });
    if (!author) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const cards = this.setsService.decodeCsvFile(file);
    if (!cards) throw new BadRequestException();

    const set = await this.setsService.createSet({
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
          data: cards.map((c) => {
            return {
              index: c.index,
              term: c.term,
              definition: c.definition
            };
          })
        }
      }
    });

    return {
      status: ApiResponseOptions.Success,
      data: set
    };
  }

  /**
   * Creates a set from an Anki .apkg file
   *
   * @returns Created `Set` object
   */
  @ApiOperation( {
    summary: "Imports a set from a .apkg file",
    description: "Converts a .apkg file to a Scholarsome set. Compatible only with simple front-back Anki sets, multiple fields currently unsupported."
  })
  @ApiConsumes("multipart/form-data")
  @ApiCreatedResponse({
    description: "Expected response to a valid request",
    type: SetSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @ApiUnsupportedMediaTypeResponse({
    description: "Uploaded file contains unsupported cards",
    type: ErrorResponse
  })
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Post("apkg")
  async importSetFromAnkiApkg(@Body() body: CreateSetFromFileDto, @Request() req: ExpressRequest, @UploadedFile() file: Express.Multer.File): Promise<ApiResponse<Set>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const author = await this.usersService.user({
      email: user.email
    });
    if (!author) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const uuid = crypto.randomUUID();

    const decoded = await this.setsService.decodeAnkiApkg(file.buffer, uuid);
    if (!decoded) throw new UnsupportedMediaTypeException({ status: "fail", message: "Set is incompatible to import" });

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
  @ApiOperation( {
    summary: "Create a set"
  })
  @ApiCreatedResponse({
    description: "Expected response to a valid request",
    type: SetSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @UseGuards(AuthenticatedGuard)
  @Post()
  async createSet(@Body() body: CreateSetDto, @Request() req: ExpressRequest): Promise<ApiResponse<Set>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const author = await this.usersService.user({
      email: user.email
    });
    if (!author) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

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
  @ApiOperation( {
    summary: "Update a set"
  })
  @ApiOkResponse({
    description: "Expected response to a valid request",
    type: SetSuccessResponse
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @UseGuards(AuthenticatedGuard)
  @Patch(":setId")
  async updateSet(@Param() params: SetIdParam, @Body() body: UpdateSetDto, @Request() req: ExpressRequest): Promise<ApiResponse<Set>> {
    const set = await this.setsService.set({
      id: params.setId
    });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    if (!(await this.setsService.verifySetOwnership(req, params.setId))) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

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
  @ApiOperation( {
    summary: "Delete a set"
  })
  @ApiOkResponse({
    description: "Expected response to a valid request",
    type: SetSuccessResponse
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Delete(":setId")
  async deleteSet(@Param() params: SetIdParam, @Request() req: ExpressRequest): Promise<ApiResponse<Set>> {
    if (!(await this.setsService.verifySetOwnership(req, params.setId))) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    await this.setsService.deleteSetMediaFiles(params.setId);

    return {
      status: ApiResponseOptions.Success,
      data: await this.setsService.deleteSet({
        id: params.setId
      })
    };
  }
}
