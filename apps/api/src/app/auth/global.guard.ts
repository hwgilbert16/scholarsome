import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private authService: AuthService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as Request;

    if (
      req.cookies &&
      "authenticated" in req.cookies
    ) {
      if (
        !("access_token" in req.cookies) &&
        "refresh_token" in req.cookies
      ) this.renewAccessToken(req, context.switchToHttp().getResponse());

      try {
        jwt.verify(req.cookies.access_token, this.configService.get<string>("JWT_TOKEN"));
      } catch (e) {
        if ("refresh_token" in req.cookies) {
          this.renewAccessToken(req, context.switchToHttp().getResponse());
        } else return false;
      }
    }

    return true;
  }

  renewAccessToken(req: Request, res: Response): boolean {
    console.log(req.url);

    let refreshToken: { id: string; email: string; type: "refresh" };

    if (!this.redis.get(req.cookies.refresh_token)) {
      this.authService.logout(req, res);
      return true;
    }

    try {
      refreshToken = jwt.verify(req.cookies["refresh_token"], this.configService.get<string>("JWT_TOKEN")) as { id: string; email: string; type: "refresh" };
    } catch (e) {
      this.authService.logout(req, res);
      return true;
    }

    const token = this.jwtService.sign({ id: refreshToken.id, email: refreshToken.email, type: "access" }, { expiresIn: "15m" });

    res.cookie("access_token", token, { httpOnly: true, expires: new Date(new Date().getTime() + 15 * 60000) });
  }
}
