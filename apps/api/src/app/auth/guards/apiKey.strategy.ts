import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Request as ExpressRequest } from "express";
import Redis from "ioredis";
import { RedisService } from "@liaoliaots/nestjs-redis";
import { AuthException } from "@api/shared/exception/exceptions/variants/auth.exception";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, "apiKey") {
  private readonly apiKeyRedis: Redis;

  constructor(private redisService: RedisService) {
    super({
      passReqToCallback: true,
    });

    this.apiKeyRedis = this.redisService.getClient("apiToken");
  }

  async validate(req: ExpressRequest) {
    if (req.header("x-api-key")) {
      const redisRes = await this.apiKeyRedis.get(req.header("x-api-key"));

      if (redisRes) {
        return {
          email: (JSON.parse(redisRes) as { id: string; email: string }).email,
        };
      }
      throw new AuthException.ApiKeyNotFound();
    }

    throw new AuthException.ApiKeyNotProvided();
  }
}
