import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { Response, Request } from "express";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { LoginDto, RegisterDto, ResetPasswordDto } from "@scholarsome/shared";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import { MailService } from "../providers/mail/mail.service";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { JwtService } from "@nestjs/jwt";

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor (
    private usersService: UsersService,
    private authService: AuthService,
    private configService: ConfigService,
    private mailService: MailService,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  /*
  *
  * Password reset routes
  *
  */

  @Post('reset/password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const decoded = jwt.verify(req.cookies['resetToken'], this.configService.get<string>('JWT_TOKEN')) as { email: string, reset: boolean };

    if (!decoded || !decoded.reset) return false;

    return await this.usersService.updateUser({
      where: {
        email: decoded.email
      },
      data: {
        password: await bcrypt.hash(resetPasswordDto.password, 10)
      }
    });
  }

  @Get('reset/password/setCookie/:token')
  async setResetCookie(@Param() params: { token: string }, @Res() res: Response) {
    const decoded = jwt.verify(params.token, this.configService.get<string>('JWT_TOKEN')) as { email: string, reset: boolean };

    if (decoded && decoded.reset) {
      res.cookie('resetToken', params.token, { httpOnly: false, expires: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) });
    }

    return res.redirect('/reset');
  }

  @Throttle(1, 600)
  @Get('reset/password/:email')
  async sendReset(@Param() params: { email: string }) {
    const user = this.usersService.user({ email: params.email });

    if (!user) return;

    return await this.mailService.sendPasswordReset(params.email);
  }

  /*
  *
  * Registration routes
  *
  */

  @Get('verify/email/:token')
  async verifyEmail(@Param() params: { token: string }, @Res() res: Response) {
    const email = jwt.verify(params.token, this.configService.get<string>('JWT_TOKEN')) as { email: string };
    if (!email) return false;

    const verification = await this.usersService.updateUser({
      where: {
        email: email.email
      },
      data: {
        verified: true
      }
    });

    if (verification) {
      res.cookie('verified', true, { expires: new Date(new Date().setSeconds(new Date().getSeconds() + 30)) });
    } else {
      res.cookie('verified', false, { expires: new Date(new Date().setSeconds(new Date().getSeconds() + 30)) });
    }

    return res.redirect('/');
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response): Promise<void> {
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
        verified: !this.configService.get<boolean>('SMTP_HOST')
      });

      if (await this.mailService.sendEmailConfirmation(registerDto.email)) {
        res.status(201);
      } else {
        res.status(200);
      }
    }
  }

  /*
  *
  * Login routes
  *
  */

  @Get('authenticated')
  checkToken(@Req() req: Request) {
    try {
      jwt.verify(req.cookies['access_token'], this.configService.get<string>('JWT_TOKEN'));
    } catch (e) {
      return false;
    }

    return true;
  }

  @Throttle(1, 600)
  @Post('refresh')
  refreshAccessToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    let refresh: { id: string; email: string; type: 'refresh' };

    try {
      if (!this.redis.get(req.cookies['refresh_token'])) return false;

      refresh = jwt.verify(req.cookies['refresh_token'], this.configService.get<string>('JWT_TOKEN')) as { id: string; email: string; type: 'refresh' };
    } catch (e) {
      this.logout(res, req);
      return false;
    }

    res.cookie('access_token', this.jwtService.sign({ id: refresh.id, email: refresh.email, type: 'access' }, { expiresIn: '15m' }), { httpOnly: true, expires: new Date(new Date().getTime() + 15 * 60000) });

    return true;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    res.cookie('verified', '', { httpOnly: false, expires: new Date() });

    const user = await this.usersService.user({
      email: loginDto.email
    });

    if (!user) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const refreshToken = this.jwtService.sign({ id: user.id, email: user.email, type: 'refresh' }, { expiresIn: '182d' });

    res.cookie('refresh_token', refreshToken, { httpOnly: true, expires: new Date(new Date().setDate(new Date().getDate() + 182)) });
    this.redis.set(user.email, refreshToken);

    res.cookie('access_token', this.jwtService.sign({ id: user.id, email: user.email, type: 'access' }, { expiresIn: '15m' }), { httpOnly: true, expires: new Date(new Date().getTime() + 15 * 60000) });
    res.cookie('authenticated', true, { httpOnly: false, expires: new Date(new Date().setDate(new Date().getDate() + 182)) });

    return;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    res.cookie('access_token', '', { httpOnly: true, expires: new Date() });
    res.cookie('refresh_token', '', { httpOnly: true, expires: new Date() });
    res.cookie('authenticated', '', { httpOnly: false, expires: new Date() });

    const user = jwt.decode(req.cookies.access_token);
    if (user && 'email' in (user as jwt.JwtPayload)) {
      this.redis.del(user['email']);
    }
  }
}
