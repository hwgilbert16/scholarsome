import {
  BadRequestException,
  Body,
  Controller,
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
  UseInterceptors
} from "@nestjs/common";
import { Express, Request as ExpressRequest, Response } from "express";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";
import { SetsService } from "../sets/sets.service";
import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";
import { S3 } from "@aws-sdk/client-s3";
// needed for multer file type declaration
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { Multer } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import * as sharp from "sharp";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { SetIdAndFileParam } from "./param/setIdAndFile.param";
import { ApiResponseOptions } from "@scholarsome/shared";
import { ErrorResponse } from "../shared/response/error.response";
import { SetAvatarDto } from "./dto/setAvatar.dto";

@ApiTags("Media")
@Controller("media")
export class MediaController {
  constructor(
    private readonly usersService: UsersService,
    private readonly setsService: SetsService,
    private readonly configService: ConfigService
  ) {}

  @ApiOperation({
    summary: "Get a set media file",
    description: "Retrieves a media file that is attached to a set"
  })
  @ApiOkResponse({
    description: "File content"
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse
  })
  @Get("/sets/:setId/:file")
  async getSetFile(@Param() params: SetIdAndFileParam, @Request() req: ExpressRequest, @Res({ passthrough: true }) res: Response) {
    const set = await this.setsService.set({
      id: params.setId
    });
    if (!set) throw new NotFoundException({ status: "fail", message: "Set not found" });

    if (set.private) {
      const userCookie = this.usersService.getUserInfo(req);

      if (!userCookie || set.authorId !== userCookie.id) {
        throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });
      }
    }

    if (
      this.configService.get<string>("STORAGE_TYPE") === "s3"
    ) {
      let file: GetObjectCommandOutput;

      const s3 = await new S3({
        credentials: {
          accessKeyId: this.configService.get<string>("S3_STORAGE_ACCESS_KEY"),
          secretAccessKey: this.configService.get<string>("S3_STORAGE_SECRET_KEY")
        },
        endpoint: this.configService.get<string>("S3_STORAGE_ENDPOINT"),
        region: this.configService.get<string>("S3_STORAGE_REGION")
      });

      try {
        file = await s3.getObject({
          Key: "media/sets/" + params.setId + "/" + params.file,
          Bucket: this.configService.get<string>("S3_STORAGE_BUCKET")
        });
      } catch (e) {
        throw new NotFoundException({ status: "fail", message: "Media not found" });
      }

      res.writeHead(200, {
        "Content-Type": "image/" + params.file.split(".").pop()
      });

      res.write(await file.Body.transformToByteArray());
    }

    if (this.configService.get<string>("STORAGE_TYPE") === "local") {
      const filePath = path.join(this.configService.get<string>("STORAGE_LOCAL_DIR"), "media", "sets", params.setId, params.file);

      if (fs.existsSync(filePath)) {
        res.writeHead(200, {
          "Content-Type": "image/" + params.file.split(".").pop()
        });

        res.write(fs.readFileSync(filePath));

        res.end();
      } else {
        throw new NotFoundException({ status: "fail", message: "Media not found" });
      }
    }
  }

  @ApiOperation({
    summary: "Get a avatar",
    description: "Retrieves a user avatar based on their user ID"
  })
  @ApiOkResponse({
    description: "Avatar content"
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse
  })
  @ApiQuery({
    name: "width",
    description: "The width of the returned image",
    required: false
  })
  @ApiQuery({
    name: "height",
    description: "The height of the returned image",
    required: false
  })
  @Get("/avatars/:userId?")
  async getAvatar(
    @Param() params: { userId: string },
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
    @Query("width") width: string,
    @Query("height") height: string
  ) {
    let userId = "";

    if (params.userId) {
      userId = params.userId;
    } else {
      const userCookie = this.usersService.getUserInfo(req);
      if (!userCookie) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

      userId = userCookie.id;
    }

    if (
      this.configService.get<string>("STORAGE_TYPE") === "s3"
    ) {
      let file: GetObjectCommandOutput;

      const s3 = await new S3({
        credentials: {
          accessKeyId: this.configService.get<string>("S3_STORAGE_ACCESS_KEY"),
          secretAccessKey: this.configService.get<string>("S3_STORAGE_SECRET_KEY")
        },
        endpoint: this.configService.get<string>("S3_STORAGE_ENDPOINT"),
        region: this.configService.get<string>("S3_STORAGE_REGION")
      });

      try {
        file = await s3.getObject({
          Key: "media/avatars/" + userId + ".jpeg",
          Bucket: this.configService.get<string>("S3_STORAGE_BUCKET")
        });
      } catch (e) {
        throw new NotFoundException({ status: "fail", message: "Media not found" });
      }

      res.writeHead(200, {
        "Content-Type": "image/jpeg"
      });

      if (height || width) {
        res.write(
            await sharp(await file.Body.transformToByteArray())
                .resize({
                  width: width ? Number(width) : 128,
                  height: height ? Number(height) : 128
                })
                .toBuffer()
        );
      } else {
        res.write(await file.Body.transformToByteArray());
      }
    } else if (this.configService.get<string>("STORAGE_TYPE") === "local") {
      const filePath = path.join(this.configService.get<string>("STORAGE_LOCAL_DIR"), "media", "avatars", userId + ".jpeg");

      if (fs.existsSync(filePath)) {
        res.writeHead(200, {
          "Content-Type": "image/jpeg"
        });

        if (height || width) {
          res.write(
              await sharp(fs.readFileSync(filePath))
                  .resize({
                    width: width ? Number(width) : 128,
                    height: height ? Number(height) : 128
                  })
                  .toBuffer()
          );
        } else {
          res.write(fs.readFileSync(filePath));
        }

        res.end();
      } else {
        throw new NotFoundException({ status: "fail", message: "Media not found" });
      }
    }
  }

  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({
    summary: "Set a user's avatar"
  })
  @ApiOkResponse({
    description: "Expected response to a valid request"
  })
  @ApiUnauthorizedResponse({
    description: "Invalid authentication to access the requested resource",
    type: ErrorResponse
  })
  @Post("/avatars")
  async setAvatar(@Body() setAvatarDto: SetAvatarDto, @Request() req: ExpressRequest, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException();

    const userCookie = this.usersService.getUserInfo(req);
    if (!userCookie) throw new UnauthorizedException({ status: "fail", message: "Invalid authentication to access the requested resource" });

    const avatar = await sharp(file.buffer)
        .jpeg({ progressive: true, force: true, quality: 80 })
        .resize({ width: 128, height: 128, fit: "cover" })
        .flatten({ background: "#ffffff" })
        .toBuffer();

    if (
      this.configService.get<string>("STORAGE_TYPE") === "s3"
    ) {
      const s3 = await new S3({
        credentials: {
          accessKeyId: this.configService.get<string>("S3_STORAGE_ACCESS_KEY"),
          secretAccessKey: this.configService.get<string>("S3_STORAGE_SECRET_KEY")
        },
        endpoint: this.configService.get<string>("S3_STORAGE_ENDPOINT"),
        region: this.configService.get<string>("S3_STORAGE_REGION")
      });

      await s3.putObject({ Body: avatar, Bucket: this.configService.get<string>("S3_STORAGE_BUCKET"), Key: "media/avatars/" + userCookie.id + ".jpeg" });
    } else if (this.configService.get<string>("STORAGE_TYPE") === "local") {
      const filePath = path.join(this.configService.get<string>("STORAGE_LOCAL_DIR"), "media", "avatars");

      if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });

      fs.writeFileSync(path.join(filePath, userCookie.id + ".jpeg"), avatar);
    }

    return {
      status: ApiResponseOptions.Success,
      data: null
    };
  }
}
