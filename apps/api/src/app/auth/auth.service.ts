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
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  /**
   * @ignore
   */
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  /**
   * Validates whether a recaptcha token passes a score of >= 0.5
   *
   * @param token Generated client-side recaptcha token
   * @returns Result of whether token is >= 0.5
   */
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

  /**
   * Validates whether a user's input password matches the hashed database version
   *
   * @param email Email of the user
   * @param password Password of the user
   * @returns Whether the user's password matches their hashed password
   */
  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.usersService.user({
      email
    });

    if (!user || !user.verified) throw new UnauthorizedException();

    return !!(bcrypt.compare(password, user.password));
  }

  /**
   * Logs a user out
   */
  async logout(req: Request, res: Response) {
    res.cookie("access_token", "", { httpOnly: true, expires: new Date() });
    res.cookie("refresh_token", "", { httpOnly: true, expires: new Date() });
    res.cookie("authenticated", "", { httpOnly: false, expires: new Date() });

    const user = jwt.decode(req.cookies.access_token);
    if (user && "email" in (user as jwt.JwtPayload)) {
      this.redis.del(user["email"]);
    }
  }
}
