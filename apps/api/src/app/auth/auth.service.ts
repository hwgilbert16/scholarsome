import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "../providers/database/users/users.service";
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";
import { MailService } from "../providers/mail/mail.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  logoutUser(res: Response): void {
    res.cookie('access_token', '', { httpOnly: true, expires: new Date() });
    res.cookie('authenticated', '', { httpOnly: false, expires: new Date() });
  }

  async validateRecaptcha(token: string) {
    const body = {
      secret: this.configService.get<string>('RECAPTCHA_SECRET'),
      response: token
    };

    const req = await lastValueFrom(this.httpService.post('https://developers.google.com/recaptcha/docs/verify#api_request', body));

    console.log(req);
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.usersService.user({
      email
    });

    if (!user) throw new UnauthorizedException();

    return !!(await bcrypt.compare(password, user.password));
  }

  async authenticateUser(loginDto: LoginDto, res: Response): Promise<void> {
    const user = await this.usersService.user({
      email: loginDto.email
    });

    if (!user) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    res.cookie('access_token', this.jwtService.sign({ id: user.id, email: user.email }), { httpOnly: true, expires: new Date(new Date().setDate(new Date().getDate() + 14)) });
    res.cookie('authenticated', true, { httpOnly: false, expires: new Date(new Date().setDate(new Date().getDate() + 14)) });

    return;
  }

  async registerUser(registerDto: RegisterDto) {
    if (
      await this.usersService.user({ email: registerDto.email })
      ||
      await this.usersService.user({ username: registerDto.username })
    ) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    } else {
      await this.usersService.createUser({
        username: registerDto.username,
        email: registerDto.email,
        password: await bcrypt.hash(registerDto.password, 10),
      });
    }
  }
}
