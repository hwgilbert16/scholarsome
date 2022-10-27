import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { SetsService } from "../providers/database/sets/sets.service";
import { UsersService } from "../providers/database/users/users.service";

@Injectable()
export class SelfStrategy extends PassportStrategy(Strategy, 'self') {
  constructor(
    private configService: ConfigService,
    private setsService: SetsService,
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
        if (
          req.cookies &&
          'access_token' in req.cookies
        ) {
          return req.cookies.access_token;
        }
        return null;
      }]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_TOKEN'),
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: { id: string; email: string; }) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    const id = req.originalUrl.split('/')[3];
    const user = await this.usersService.user({
      id: payload.id
    });

    if (!id || !user) throw new BadRequestException();

    const set = await this.setsService.set({
      id
    });

    if (set.private && (set.authorId !== payload.id)) throw new UnauthorizedException();

    return { email: payload.email };
  }
}
