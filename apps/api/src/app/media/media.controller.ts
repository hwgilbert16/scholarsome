import {
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
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { SetIdAndFileParam } from "./param/setIdAndFile.param";
import { ErrorResponse } from "../shared/response/error.response";

@ApiTags("Media")
@Controller("media")
export class MediaController {
  constructor(
    private readonly usersService: UsersService,
    private readonly setsService: SetsService,
    private readonly configService: ConfigService
  ) {}


  @ApiOperation({ summary: "Gets the media file for a Set" })
  @ApiOkResponse({
    description: "Expected response contain binary image data.",
    type: String
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse
  })
  @ApiParam({ name: "setId", type: "string", description: "Set ID for which file needs to be fetched." })
  @ApiParam({ name: "file", type: "string", description: "File which needs to be fetched for a given set." })

  @Get("/sets/:setId/:file")
  async getSetFile(@Param() params: SetIdAndFileParam, @Request() req: ExpressRequest, @Res({ passthrough: true }) res: Response) {
    const { setId, file } = params;
    const set = await this.setsService.set({
      id: setId
    });
    if (!set) throw new NotFoundException();

    if (set.private) {
      const userCookie = this.usersService.getUserInfo(req);

      if (!userCookie) throw new NotFoundException();
      if (set.authorId !== userCookie.id) throw new NotFoundException();
    }

    if (
      this.configService.get<string>("STORAGE_TYPE") === "s3"
    ) {
      let result: GetObjectCommandOutput;

      const s3 = new S3({
        credentials: {
          accessKeyId: this.configService.get<string>("S3_STORAGE_ACCESS_KEY"),
          secretAccessKey: this.configService.get<string>("S3_STORAGE_SECRET_KEY")
        },
        endpoint: this.configService.get<string>("S3_STORAGE_ENDPOINT"),
        region: this.configService.get<string>("S3_STORAGE_REGION")
      });

      try {
        result = await s3.getObject({
          Key: "media/sets/" + setId + "/" + file,
          Bucket: this.configService.get<string>("S3_STORAGE_BUCKET")
        });
      } catch (e) {
        throw new NotFoundException();
      }

      res.writeHead(200, {
        "Content-Type": "image/" + file.split(".").pop()
      });

      res.write(await result.Body.transformToByteArray());
    }

    if (this.configService.get<string>("STORAGE_TYPE") === "local") {
      const filePath = path.join(this.configService.get<string>("STORAGE_LOCAL_DIR"), "media", "sets", setId, file);

      if (fs.existsSync(filePath)) {
        res.writeHead(200, {
          "Content-Type": "image/" + file.split(".").pop()
        });

        res.write(fs.readFileSync(filePath));

        res.end();
      } else {
        throw new NotFoundException();
      }
    }
  }

  @ApiOperation({ summary: "Gets the avatar of the User" })
  @ApiOkResponse({
    description: "Expected response contain binary image data.",
    type: String
  })
  @ApiNotFoundResponse({
    description: "Resource not found or inaccessible",
    type: ErrorResponse
  })
  @ApiParam({ name: "userId", type: "string", description: "User ID for which avatar needs to be fetched." })
  @ApiQuery({ name: "width", description: "required width of the image (defaults to 128)", type: "string" })
  @ApiQuery({ name: "height", description: "required height of the image (defaults to 128)", type: "string" })

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
      if (!userCookie) throw new NotFoundException();

      userId = userCookie.id;
    }

    if (
      this.configService.get<string>("STORAGE_TYPE") === "s3"
    ) {
      let file: GetObjectCommandOutput;

      const s3 = new S3({
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
        throw new NotFoundException();
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
        throw new NotFoundException();
      }
    }
  }

  @Post("/avatars")
  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(AuthenticatedGuard)
  async setAvatar(@Request() req: ExpressRequest, @UploadedFile() file: Express.Multer.File) {
    const userCookie = this.usersService.getUserInfo(req);
    if (!userCookie) throw new UnauthorizedException();

    const avatar = await sharp(file.buffer)
        .jpeg({ progressive: true, force: true, quality: 80 })
        .resize({ width: 128, height: 128, fit: "cover" })
        .flatten({ background: "#ffffff" })
        .toBuffer();

    if (
      this.configService.get<string>("STORAGE_TYPE") === "s3"
    ) {
      const s3 = new S3({
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
  }
}
