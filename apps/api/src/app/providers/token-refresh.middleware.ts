import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth/auth.service";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

@Injectable()
export class TokenRefreshMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (
      req.cookies &&
      "authenticated" in req.cookies &&
      !("access_token" in req.cookies) &&
      !("refresh_token" in req.cookies)
    ) {
      this.authService.logout(req, res);
      return next();
    }

    if (
      req.cookies &&
      "authenticated" in req.cookies
    ) {
      // if you have an access token but no refresh token, we know you need a new one
      if (
        !("access_token" in req.cookies) &&
        "refresh_token" in req.cookies
      ) this.renewAccessToken(req, res);

      // if your access token is expired
      try {
        jwt.verify(req.cookies.access_token, this.configService.get<string>("JWT_SECRET"));
      } catch (e) {
        // and you have a refresh token
        if ("refresh_token" in req.cookies) {
          // renew your access token
          this.renewAccessToken(req, res);
        } else {
          this.authService.logout(req, res);
        }
      }
    }

    next();
  }

  renewAccessToken(req: Request, res: Response): boolean {
    let refreshToken: { id: string; sessionId: string; email: string; type: "refresh" };

    try {
      refreshToken = jwt.verify(req.cookies["refresh_token"], this.configService.get<string>("JWT_SECRET")) as { id: string; sessionId: string; email: string; type: "refresh" };
    } catch (e) {
      this.authService.logout(req, res);
      return true;
    }

    if (!refreshToken.sessionId || !this.redis.get(req.cookies["refresh_token"].sessionId)) {
      this.authService.logout(req, res);
      return true;
    }

    const accessToken = this.jwtService.sign({ id: refreshToken.id, sessionId: crypto.randomUUID(), email: refreshToken.email, type: "access" }, { expiresIn: "15m" });

    // the route following this interceptor will not see the cookie unless if we modify the cookie object here
    // this is only for the request that this interceptor is directly in front of
    req.cookies["access_token"] = accessToken;

    // but this actually sets the cookie for future requests
    res.cookie("access_token", accessToken, { httpOnly: true, expires: new Date(new Date().getTime() + 15 * 60000) });
  }
}
