import { Injectable } from "@nestjs/common";
import { PrismaService } from "../providers/database/prisma/prisma.service";
import { Prisma, Card as PrismaCard } from "@prisma/client";
import { Card } from "@scholarsome/shared";
import * as sharp from "sharp";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { InjectS3, S3 } from "nestjs-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CardsService {
  /**
   * @ignore
   */
  constructor(
    @InjectS3() private readonly s3: S3,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  /**
   * Scans a string for HTML tags that contain a src,
   * and uploads them to the designated storage destination
   *
   * @param side The string to scan
   * @param setId The ID of the set that the card is apart of
   *
   * @returns The string with updated src values
   */
  async scanAndUploadMedia(side: string, setId: string): Promise<string | false> {
    const matches = side.match(/<[^>]+src="([^">]+)"/g);

    if (matches) {
      let sources = Object.values(matches);
      if (!sources) return false;

      sources = sources.map((x) => x.replace(/.*src="([^"]*)".*/, "$1"));

      for (const source of sources) {
        const split: string[] = source.split(",");
        if (split.length === 0 || split.length !== 2) continue;

        let decoded = Buffer.from(split[1], "base64");

        let extension = "." + source.match(/^data:[a-z]+\/([a-z]+);base64,/)[1];

        if (
          split[0].includes("jpeg") ||
          split[0].includes("jpg") ||
          split[0].includes("png") ||
          split[0].includes("tiff") ||
          split[0].includes("webp")
        ) {
          decoded = await sharp(decoded).jpeg({ progressive: true, force: true, quality: 80 }).toBuffer();
          extension = ".jpeg";
        }

        const fileName = setId + "/" + crypto.randomUUID() + extension;

        // upload to s3
        if (
          this.configService.get<string>("STORAGE_TYPE") === "s3" ||
          this.configService.get<string>("STORAGE_TYPE") === "S3"
        ) {
          await this.s3.putObject({ Body: decoded, Bucket: this.configService.get<string>("S3_STORAGE_BUCKET"), Key: "media/" + fileName });
        }

        // upload locally
        if (this.configService.get<string>("STORAGE_TYPE") === "local") {
          const filePath = path.join(this.configService.get<string>("STORAGE_LOCAL_DIR"), "media");

          if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);
          if (!fs.existsSync(path.join(filePath, setId))) fs.mkdirSync(path.join(filePath, setId));

          fs.writeFileSync(path.join(filePath, fileName), decoded);
        }

        side = side.replace(source, "/api/media/" + fileName);
      }
    } else return false;

    return side;
  }

  /**
   * Queries the database for a unique card
   *
   * @param cardWhereUniqueInput Prisma `CardWhereUniqueInput` selector object
   *
   * @returns Queried `Card` object
   */
  async card(
      cardWhereUniqueInput: Prisma.CardWhereUniqueInput
  ): Promise<Card | null> {
    return this.prisma.card.findUnique({
      where: cardWhereUniqueInput,
      include: { set: true }
    });
  }


  /**
   * Queries the database for multiple cards
   *
   * @param params.skip Optional, Prisma skip selector
   * @param params.take Optional, Prisma take selector
   * @param params.cursor Optional, Prisma cursor selector
   * @param params.where Optional, Prisma where selector
   * @param params.orderBy Optional, Prisma orderBy selector
   *
   * @returns Array of queried `Card` objects
   */
  async cards(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CardWhereUniqueInput;
    where?: Prisma.CardWhereInput;
    orderBy?: Prisma.CardOrderByWithRelationInput;
  }): Promise<Card[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.card.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        set: true
      }
    });
  }

  /**
   * Creates a card in the database
   *
   * @param data Prisma `CardCreateInput` selector
   *
   * @returns Created `Card` object
   */
  async createCard(data: Prisma.CardCreateInput): Promise<PrismaCard> {
    return this.prisma.card.create({
      data
    });
  }

  /**
   * Updates a card in the database
   *
   * @param params.where Prisma where selector
   * @param params.data Prisma data selector
   *
   * @returns Updated `Card` object
   */
  async updateCard(params: {
    where: Prisma.CardWhereUniqueInput;
    data: Prisma.CardUpdateInput;
  }): Promise<PrismaCard> {
    const { where, data } = params;
    return this.prisma.card.update({
      data,
      where
    });
  }


  /**
   * Deletes a card from the database
   *
   * @param where Prisma CardWhereUniqueInput selector
   *
   * @returns `Card` object that was deleted
   */
  async deleteCard(where: Prisma.CardWhereUniqueInput): Promise<PrismaCard> {
    return this.prisma.card.delete({
      where
    });
  }
}
