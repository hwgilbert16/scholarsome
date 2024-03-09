import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { AccessTokenPayload } from "../types/token-payload.interface";
import { TokenUser } from "../types/token-user.interface";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy,
    "accessToken"
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (!req.cookies) return null;
          return req.cookies["access_token"];
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET")
    });
  }

  public async validate(payload: AccessTokenPayload): Promise<TokenUser> {
    if (typeof payload.email !== "string" || payload.type !== "access") {
      throw new UnauthorizedException("Invalid access token provided");
    }

    return { email: payload.email };
  }
}
