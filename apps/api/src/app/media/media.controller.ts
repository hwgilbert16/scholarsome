import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  Res, UnauthorizedException,
  UploadedFile, UseGuards,
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
import { SetIdAndFileParam } from "@scholarsome/shared";
// needed for multer file type declaration
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { Multer } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthenticatedGuard } from "../auth/authenticated.guard";
import * as sharp from "sharp";

@Controller("media")
export class MediaController {
  constructor(
    private readonly usersService: UsersService,
    private readonly setsService: SetsService,
    private readonly configService: ConfigService
  ) {}

  @Get("/sets/:setId/:file")
  async getSetFile(@Param() params: SetIdAndFileParam, @Request() req: ExpressRequest, @Res({ passthrough: true }) res: Response) {
    const set = await this.setsService.set({
      id: params.setId
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
        throw new NotFoundException();
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
        throw new NotFoundException();
      }
    }
  }

  @Get("/avatars/:userId?")
  async getAvatar(@Param() params: { userId: string }, @Request() req: ExpressRequest, @Res({ passthrough: true }) res: Response) {
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
        throw new NotFoundException();
      }

      res.writeHead(200, {
        "Content-Type": "image/jpeg"
      });

      res.write(await file.Body.transformToByteArray());
    } else if (this.configService.get<string>("STORAGE_TYPE") === "local") {
      const filePath = path.join(this.configService.get<string>("STORAGE_LOCAL_DIR"), "media", "avatars", userId + ".jpeg");

      if (fs.existsSync(filePath)) {
        res.writeHead(200, {
          "Content-Type": "image/jpeg"
        });

        res.write(fs.readFileSync(filePath));

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
  }
}
