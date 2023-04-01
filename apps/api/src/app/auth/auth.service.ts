import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { MailService } from "../providers/mail/mail.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { RecaptchaResponse } from "@scholarsome/shared";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  async validateRecaptcha(token: string): Promise<boolean> {
    const body = {
      secret: this.configService.get<string>("RECAPTCHA_SECRET"),
      response: token
    };

    const googleRes = await lastValueFrom(this.httpService.post<RecaptchaResponse>(
        "https://www.google.com/recaptcha/api/siteverify",
        new URLSearchParams(Object.entries(body)).toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        }));

    if (googleRes.data["error-codes"]) return false;

    return googleRes.data.score >= 0.5;
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.usersService.user({
      email
    });

    if (!user || !user.verified) throw new UnauthorizedException();

    return !!(await bcrypt.compare(password, user.password));
  }
}
