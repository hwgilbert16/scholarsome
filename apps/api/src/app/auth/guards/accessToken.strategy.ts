import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import { AuthException } from "@api/shared/exception/exceptions/variants/auth.exception";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  "accessToken"
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req.cookies && "access_token" in req.cookies) {
            return req.cookies.access_token;
          }

          throw new AuthException.TokenNotProvided();
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>("JWT_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    try {
      jwt.verify(
        req.cookies.access_token,
        this.configService.get<string>("JWT_SECRET")
      );
    } catch (e) {
      throw new AuthException.InvalidTokenProvided();
    }

    if (!payload) throw new AuthException.InvalidTokenProvided();

    return { email: payload.email };
  }
}
