import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private httpService: HttpService) {
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
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    return { email: payload.email };
  }
}
