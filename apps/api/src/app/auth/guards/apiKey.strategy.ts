import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { Request as ExpressRequest } from "express";
import Redis from "ioredis";
import { RedisService } from "@liaoliaots/nestjs-redis";
import { TokenUser } from "../types/token-user.interface";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, "apiKey") {
  private readonly apiKeyRedis: Redis;

  constructor(private redisService: RedisService) {
    super();

    this.apiKeyRedis = this.redisService.getClient("apiToken");
  }

  async validate(req: ExpressRequest): Promise<TokenUser> {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
      throw new UnauthorizedException({
        status: "fail",
        message: "Invalid authentication to access the requested resource",
      });
    }

    const id = await this.apiKeyRedis.get(req.header("x-api-key"));

    if (!id) {
      throw new InternalServerErrorException("Failed to retrieve API key data");
    }

    return { id };
  }
}
