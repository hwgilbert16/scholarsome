import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Request,
  Response,
  StreamableFile,
  UnauthorizedException,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { SetsService } from "../sets/sets.service";
import { UsersService } from "../users/users.service";
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse
} from "@nestjs/swagger";
import { SetIdParam } from "../sets/param/setIdParam.param";
import { Request as ExpressRequest, Response as ExpressResponse, Express } from "express";
import { ErrorResponse } from "../shared/response/error.response";
import { QuizletExportParams } from "./param/quizletExportParams";
import { CardsService } from "../cards/cards.service";
import { ApiResponse, ApiResponseOptions } from "@scholarsome/shared";
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { SetSuccessResponse } from "../sets/response/success/set.success.response";
import { ImportSetFromFileDto } from "./dto/importSetFromFile.dto";
import * as crypto from "crypto";
import { Set } from "@prisma/client";
import { ConvertingService } from "./converting.service";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { ImportSetFromQuizletDto } from "./dto/importSetFromQuizlet.dto";

@ApiTags("Converting")
@UseGuards(ThrottlerGuard)
@Controller("converting")
export class ConvertingController {
  constructor(
    private readonly setsService: SetsService,
    private readonly usersService: UsersService,
    private readonly cardsService: CardsService,
    private readonly convertingService: ConvertingService
  ) {}

  /**
   * Converts a set to a .txt file that can be imported into Quizlet
   *
   * @remarks Throttled to 1 request every 3 seconds
   */
  @ApiOperation( {
    summary: "Export a set to a .txt that can be imported in Quizlet",
    description: "Converts a Scholarsome set to a .txt that can be imported in Quizlet. Media (images, videos, etc) will not be included in the exported file.\n\nLearn more by clicking <a href='../usage/sets/exporting-sets/#exporting-to-quizlet'>here.</a>"
  })
  @ApiOkResponse({
    description: "Exported file downloaded successfully"
  })
  @ApiBadRequestResponse({
    description: "Set contains occurrences of side or card discriminators",
    type: ErrorResponse
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Throttle(1, 3)
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

    const txt = this.convertingService.convertSetToQuizletTxt(set, params.sideDiscriminator, params.cardDiscriminator);
    if (!txt) throw new BadRequestException("At least one card in the set contains side or card discriminator characters. The set must not contain the characters being used to format the exported set.");

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${set.title + ".txt"}`
    });

    return new StreamableFile(txt);
  }

  /**
   * Exports a set to an Anki-compatible .apkg file
   *
   * @remarks Throttled to 1 request every 3 seconds
   */
  @ApiOperation( {
    summary: "Export a set to an Anki-compatible .apkg file",
    description: "Converts a Scholarsome set to an Anki-compatible .apkg file. Includes media (images, videos, etc) in the .apkg file.\n\nLearn more by clicking <a href='../usage/sets/exporting-sets/#exporting-to-anki'>here.</a>"
  })
  @ApiOkResponse({
    description: "Exported file downloaded successfully"
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Throttle(1, 3)
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

    const apkg = await this.convertingService.convertSetToApkg(set);
    if (!apkg) throw new InternalServerErrorException("Error converting set to apkg file");

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${set.title + ".apkg"}`
    });

    return new StreamableFile(apkg);
  }

  /**
   * Exports a set to a .csv file
   *
   * @remarks Throttled to 1 request every 3 seconds
   */
  @ApiOperation( {
    summary: "Export a set to a .csv file",
    description: "Converts a Scholarsome set to a .csv file. Media (images, videos, etc) will not be included in the exported file.\n\nLearn more by clicking <a href='../usage/sets/exporting-sets/#exporting-to-a-csv-file'>here.</a>"
  })
  @ApiOkResponse({
    description: "Exported file downloaded successfully"
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Throttle(1, 3)
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

    const csv = this.convertingService.convertSetToCsv(set);
    if (!csv) throw new InternalServerErrorException("Error converting set to csv file");

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${set.title + ".csv"}`
    });

    return new StreamableFile(csv);
  }

  /**
   * Exports the media of a set in a .zip file
   *
   * @remarks Throttled to 1 request every 3 seconds
   */
  @ApiOperation( {
    summary: "Export the media of a set in a .zip file",
    description: "Gets the media content of a set and packages it into a .zip file\n\nLearn more by clicking <a href='../usage/sets/exporting-sets/#exporting-media'>here.</a>"
  })
  @ApiOkResponse({
    description: "Exported file downloaded successfully"
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Throttle(1, 3)
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

    const zip = await this.convertingService.createZipOfSetMedia(set.id);
    if (zip === false) throw new InternalServerErrorException();
    if (zip === null) throw new HttpException("No Content", HttpStatus.NO_CONTENT);

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${set.title + " Media.zip"}`
    });

    return new StreamableFile(zip);
  }

  /**
   * Creates a set from a set exported from Quizlet
   *
   * @returns Created `Set` object
   */
  @ApiOperation( {
    summary: "Import a set from Quizlet",
    description: "Converts a set exported from Quizlet into a Scholarsome set.\n\nLearn more by clicking <a href='../usage/sets/importing-sets/#importing-from-quizlet'>here.</a>"
  })
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
  @Post("import/quizlet")
  async importSetFromQuizletTxt(@Body() body: ImportSetFromQuizletDto, @Request() req: ExpressRequest): Promise<ApiResponse<Set>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const author = await this.usersService.user({
      email: user.email
    });
    if (!author) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const cards = this.convertingService.quizletStringToCards(body.set, body.sideDiscriminator, body.cardDiscriminator);
    if (!cards) throw new BadRequestException("The set is not correctly formatted");

    const set = await this.setsService.createSet({
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
    summary: "Import a set from a .apkg file",
    description: "Converts a .apkg file to a Scholarsome set. Compatible only with simple front-back Anki sets.\n\nLearn more by clicking <a href='../usage/sets/importing-sets/#importing-from-anki'>here.</a>"
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
  @Post("import/apkg")
  async importSetFromAnkiApkg(@Body() body: ImportSetFromFileDto, @Request() req: ExpressRequest, @UploadedFile() file: Express.Multer.File): Promise<ApiResponse<Set>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const author = await this.usersService.user({
      email: user.email
    });
    if (!author) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const uuid = crypto.randomUUID();

    const decoded = await this.convertingService.apkgToCardsAndMedia(file.buffer, uuid);
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
   * Creates a set from an Anki .apkg file
   *
   * @returns Created `Set` object
   */
  @ApiOperation( {
    summary: "Import a set from a .csv file",
    description: "Converts a .csv file to a Scholarsome set.\n\nLearn more by clicking <a href='../usage/sets/importing-sets/#importing-from-a-csv-file'>here.</a>"
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
  @Post("import/csv")
  async importSetFromCsvFile(@Body() body: ImportSetFromFileDto, @Request() req: ExpressRequest, @UploadedFile() file: Express.Multer.File): Promise<ApiResponse<Set>> {
    const user = this.usersService.getUserInfo(req);
    if (!user) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const author = await this.usersService.user({
      email: user.email
    });
    if (!author) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const cards = this.convertingService.csvToCards(file);
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
}
