import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Express, Request as ExpressRequest, Response } from "express";
import { SetsService } from "../sets/sets.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import * as sharp from "sharp";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { SetIdAndFileParam } from "./param/setIdAndFile.param";
import { ApiResponseOptions } from "@scholarsome/shared";
import { ErrorResponse } from "../shared/response/error.response";
import { SetAvatarDto } from "./dto/setAvatar.dto";
import { UserIdParam } from "../users/param/userId.param";
import { AuthService } from "../auth/services/auth.service";
import { StorageService } from "../providers/storage/storage.service";

@Controller()
export class MediaController {
  constructor(
    private readonly setsService: SetsService,
    private readonly authService: AuthService,
    private readonly storageService: StorageService
  ) {}

  @ApiTags("Sets")
  @ApiOperation({
    summary: "Get a set media file",
    description: "Retrieves a media file that is attached to a set",
  })
  @ApiOkResponse({
    description: "File content",
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse,
  })
  @Get(["sets/:setId/media/:file", "media/sets/:setId/:file"])
  async getSetFile(
    @Param() params: SetIdAndFileParam,
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    const set = await this.setsService.set({
      id: params.setId,
    });
    if (!set)
      throw new NotFoundException({ status: "fail", message: "Set not found" });

    if (set.private) {
      const userCookie = await this.authService.getUserInfo(req);

      if (!userCookie || set.authorId !== userCookie.id) {
        throw new UnauthorizedException({
          status: "fail",
          message: "Invalid authentication to access the requested resource",
        });
      }
    }

    const file = await this.storageService
      .getInstance()
      .getFile("media/sets/" + params.setId + "/" + params.file);

    if (!file)
      throw new NotFoundException({
        status: "fail",
        message: "Media not found",
      });

    res.writeHead(200, {
      "Content-Type": "image/" + params.file.split(".").pop(),
    });

    res.write(file.content);
    res.end();
  }

  @ApiTags("Sets")
  @ApiOperation({
    summary: "Get a set media file",
    description:
      "Retrieves a media file that is attached to a set. Deprecated URL - see route above for correct URL.",
    deprecated: true,
  })
  @ApiOkResponse({
    description: "File content",
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse,
  })
  @Get("media/sets/:setId/:file")
  // eslint-disable-next-line no-empty-function
  async getSetFileDeprecatedUrl() {}

  @ApiTags("Users")
  @ApiOperation({
    summary: "Get the avatar of the authenticated user",
    description: "Retrieves the avatar of the authenticated user",
  })
  @ApiOkResponse({
    description: "Avatar content",
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse,
  })
  @ApiQuery({
    name: "width",
    description: "The width of the returned image",
    required: false,
  })
  @ApiQuery({
    name: "height",
    description: "The height of the returned image",
    required: false,
  })
  @UseGuards(AuthenticatedGuard)
  @Get("users/me/avatar")
  async getMyAvatar(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
    @Query("width") width: string,
    @Query("height") height: string
  ) {
    const userCookie = await this.authService.getUserInfo(req);
    if (!userCookie)
      throw new UnauthorizedException({
        status: "fail",
        message: "Invalid authentication to access the requested resource",
      });

    const file = await this.storageService
      .getInstance()
      .getFile("media/avatars/" + userCookie.id + ".jpeg");

    if (!file)
      throw new NotFoundException({
        status: "fail",
        message: "Media not found",
      });

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
    });

    if (height || width) {
      res.write(
        await sharp(file.content)
          .resize({
            width: width ? Number(width) : 128,
            height: height ? Number(height) : 128,
          })
          .toBuffer()
      );
    } else {
      res.write(file.content);
    }
  }

  @ApiTags("Users")
  @ApiOperation({
    summary: "Get a avatar",
    description: "Retrieves a user avatar based on their user ID",
  })
  @ApiOkResponse({
    description: "Avatar content",
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse,
  })
  @ApiQuery({
    name: "width",
    description: "The width of the returned image",
    required: false,
  })
  @ApiQuery({
    name: "height",
    description: "The height of the returned image",
    required: false,
  })
  @Get("users/:userId/avatar")
  async getAvatar(
    @Param() params: UserIdParam,
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
    @Query("width") width: string,
    @Query("height") height: string
  ) {
    const file = await this.storageService
      .getInstance()
      .getFile("media/avatars/" + params.userId + ".jpeg");

    if (!file)
      throw new NotFoundException({
        status: "fail",
        message: "Media not found",
      });

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
    });

    if (height || width) {
      res.write(
        await sharp(file.content)
          .resize({
            width: width ? Number(width) : 128,
            height: height ? Number(height) : 128,
          })
          .toBuffer()
      );
    } else {
      res.write(file.content);
    }
  }

  @ApiTags("Users")
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({
    summary: "Set the authenticated user's avatar",
  })
  @ApiOkResponse({
    description: "Expected response to a valid request",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse,
  })
  @Post("user/me/avatar")
  async setMyAvatar(
    @Body() setAvatarDto: SetAvatarDto,
    @Request() req: ExpressRequest,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) throw new BadRequestException();

    const userCookie = await this.authService.getUserInfo(req);
    if (!userCookie)
      throw new UnauthorizedException({
        status: "fail",
        message: "Invalid authentication to access the requested resource",
      });

    const avatar = await sharp(file.buffer)
      .jpeg({ progressive: true, force: true, quality: 80 })
      .resize({ width: 128, height: 128, fit: "cover" })
      .flatten({ background: "#ffffff" })
      .toBuffer();

    await this.storageService
      .getInstance()
      .putFile("media/avatars/" + userCookie.id + ".jpeg", avatar);

    return {
      status: ApiResponseOptions.Success,
      data: null,
    };
  }

  @ApiTags("Users")
  @UseGuards(AuthenticatedGuard)
  @ApiOperation({
    summary: "Delete the authenticated user's avatar",
  })
  @ApiOkResponse({
    description: "Expected response to a valid request",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse,
  })
  @Delete("user/me/avatar")
  async deleteAvatar(@Request() req: ExpressRequest) {
    const userCookie = await this.authService.getUserInfo(req);
    if (!userCookie)
      throw new UnauthorizedException({
        status: "fail",
        message: "Invalid authentication to access the requested resource",
      });

    await this.storageService
      .getInstance()
      .deleteFile("media/avatars/" + userCookie.id + ".jpeg");

    return {
      status: ApiResponseOptions.Success,
      data: null,
    };
  }
}
