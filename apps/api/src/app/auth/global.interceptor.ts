import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private authService: AuthService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  /**
   * Global interceptor for the access-refresh token authentication flow.
   *
   * Renews access tokens on each request if they are missing and/or expired.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest() as Request;

    if (
      req.cookies &&
      "authenticated" in req.cookies &&
      !("access_token" in req.cookies) &&
      !("refresh_token" in req.cookies)
    ) {
      this.authService.logout(req, context.switchToHttp().getResponse());
      return next.handle();
    }

    if (
      req.cookies &&
      "authenticated" in req.cookies
    ) {
      // if you have an access token but no refresh token, we know you need a new one
      if (
        !("access_token" in req.cookies) &&
        "refresh_token" in req.cookies
      ) this.renewAccessToken(req, context.switchToHttp().getResponse());

      // if your access token is expired
      try {
        jwt.verify(req.cookies.access_token, this.configService.get<string>("JWT_TOKEN"));
      } catch (e) {
        // and you have a refresh token
        if ("refresh_token" in req.cookies) {
          // renew your access token
          this.renewAccessToken(req, context.switchToHttp().getResponse());
        } else {
          this.authService.logout(req, context.switchToHttp().getResponse());
        }
      }
    }

    return next.handle();
  }

  renewAccessToken(req: Request, res: Response): boolean {
    let refreshToken: { id: string; email: string; type: "refresh" };

    if (!this.redis.get(req.cookies.refresh_token)) {
      this.authService.logout(req, res);
      console.log("b");
      return true;
    }

    try {
      refreshToken = jwt.verify(req.cookies["refresh_token"], this.configService.get<string>("JWT_TOKEN")) as { id: string; email: string; type: "refresh" };
    } catch (e) {
      this.authService.logout(req, res);
      console.log("c");
      return true;
    }

    const token = this.jwtService.sign({ id: refreshToken.id, email: refreshToken.email, type: "access" }, { expiresIn: "15m" });

    // the route following this interceptor will not see the cookie unless if we modify the cookie object here
    // this is only for the request that this interceptor is directly in front of
    req.cookies["access_token"] = token;

    // but this actually sets the cookie for future requests
    res.cookie("access_token", token, { httpOnly: true, expires: new Date(new Date().getTime() + 15 * 60000) });
  }
}
