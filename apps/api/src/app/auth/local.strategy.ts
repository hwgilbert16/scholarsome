import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { RecaptchaResponse } from "./auth";
import { LoginDto } from "./dto/login.dto";
import { lastValueFrom } from "rxjs";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private configService: ConfigService
  ) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    },);
  }

  async validate(req, email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    const reqBody: LoginDto = req.body;

    const recaptchaBody = {
      secret: this.configService.get<string>('RECAPTCHA_SECRET'),
      response: reqBody.recaptchaToken
    };

    const googleRes = await lastValueFrom(this.httpService.post<RecaptchaResponse>(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams(Object.entries(recaptchaBody)).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }));

    return user;
  }
}
