import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth/services/auth.service";
import { InjectRedis, RedisService } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { TokenService } from "../auth/services/token.service";
import { TokenType } from "../auth/types/token-type.enum";
import { RefreshTokenPayload } from "../auth/types/token-payload.interface";

@Injectable()
export class TokenRefreshMiddleware implements NestMiddleware {
  private readonly refreshTokenRedis: Redis;

  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService,
    redisService: RedisService
  ) {
    this.refreshTokenRedis = redisService.getClient("default");
  }

  public async use(req: Request, res: Response, next: NextFunction) {
    const refreshToken = this.getTokenCookie(req, TokenType.RefreshToken);
    if (!refreshToken) return next();
    const refreshTokenPayload = await this.tokenService.decodeRefreshToken(
      refreshToken,
      true
    );
    if (Number(refreshTokenPayload.exp) < new Date().getTime() / 1000)
      return next();

    const accessToken = this.getTokenCookie(req, TokenType.AccessToken);
    if (!accessToken) {
      await this.renewAccessToken(req, res, refreshTokenPayload);
      return next();
    }

    const accessTokenPayload = await this.tokenService.decodeAccessToken(
      accessToken,
      true
    );
    if (Number(accessTokenPayload.exp) < new Date().getTime() / 1000)
      await this.renewAccessToken(req, res, refreshTokenPayload);

    next();
  }

  private getTokenCookie(req: Request, tokenType: TokenType): string | null {
    const cookie = req.cookies?.[tokenType];

    if (!cookie) return null;

    return cookie;
  }

  public async renewAccessToken(
    req: Request,
    res: Response,
    refreshToken: RefreshTokenPayload
  ) {
    const {
      accessToken,
      refreshToken: issuedRefreshToken,
      jti,
    } = await this.tokenService.refreshTokens(refreshToken);

    await this.authService.replaceTokenId(
      refreshToken.sub,
      refreshToken.jti,
      jti
    );

    res.cookie(TokenType.AccessToken, accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
    res.cookie(TokenType.RefreshToken, issuedRefreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    req.cookies[TokenType.AccessToken] = accessToken;
    req.cookies[TokenType.RefreshToken] = issuedRefreshToken;
  }
}
