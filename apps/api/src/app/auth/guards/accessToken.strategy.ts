import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { AccessTokenPayload } from "../types/token-payload.interface";
import { TokenUser } from "../types/token-user.interface";
import { RedisService } from "@liaoliaots/nestjs-redis";
import { Redis } from "ioredis";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  "accessToken"
) {
  private refreshTokenRedis: Redis;

  constructor(configService: ConfigService, redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (!req.cookies) return null;
          return req.cookies["access_token"];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });

    this.refreshTokenRedis = redisService.getClient("default");
  }

  public async validate(payload: AccessTokenPayload): Promise<TokenUser> {
    if (typeof payload.sub !== "string" || typeof payload.rti !== "string") {
      throw new UnauthorizedException("Invalid access token provided");
    }

    const isValidToken = Boolean(
      await this.refreshTokenRedis.sismember(payload.sub, payload.rti)
    );

    if (!isValidToken)
      throw new UnauthorizedException("Invalid access token provided");

    return { id: payload.sub };
  }
}
