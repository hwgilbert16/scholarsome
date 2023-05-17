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
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { ApiResponse, LoginDto, RegisterDto, ResetPasswordDto } from "@scholarsome/shared";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { MailService } from "../providers/mail/mail.service";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

@UseGuards(ThrottlerGuard)
@Controller("auth")
export class AuthController {
  /**
   * @ignore
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  /*
  * Password reset routes
  */

  /**
   * Resets the password of a user after checking for a valid reset token in their cookies.
   *
   * @returns Whether the user's password was successfully updated
   */
  @Get("reset/password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res({ passthrough: true }) res: Response, @Req() req: Request): Promise<ApiResponse<User>> {
    const decoded = jwt.verify(req.cookies["resetToken"], this.configService.get<string>("JWT_TOKEN")) as { email: string, reset: boolean };

    if (!decoded || !decoded.reset) {
      return {
        status: "fail",
        message: "Invalid reset token"
      };
    }

    const query = await this.usersService.updateUser({
      where: {
        email: decoded.email
      },
      data: {
        password: await bcrypt.hash(resetPasswordDto.password, 10)
      }
    });

    return {
      status: "success",
      data: query
    };
  }

  /**
   * Adds a reset token in cookies that can be used in the /api/auth/reset/password route to reset a password.
   *
   * @remarks This is the link that is emailed to users when a password reset is requested.
   * @returns Void, redirect to /api/auth/redirect
   */
  @Get("reset/password/setCookie/:token")
  async setResetCookie(@Param() params: { token: string }, @Res() res: Response): Promise<void> {
    const decoded = jwt.verify(params.token, this.configService.get<string>("JWT_TOKEN")) as { email: string, reset: boolean };

    if (decoded && decoded.reset) {
      res.cookie("resetToken", params.token, { httpOnly: false, expires: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) });
    }

    return res.redirect("/reset");
  }

  /**
   * Sends a password reset for a given user
   *
   * @remarks Throttled to 1 request per 40 seconds
   * @returns Call to send a password reset email
   */
  @Throttle(0, 600)
  @Get("reset/password/:email")
  async sendReset(@Param() params: { email: string }): Promise<ApiResponse<null>> {
    const user = this.usersService.user({ email: params.email });

    if (user) {
      await this.mailService.sendPasswordReset(params.email);
    }

    return {
      status: "success",
      data: null
    };
  }

  /*
  * Registration routes
  */

  /**
   * Verifies a users email given a successfully validated token
   *
   * @remarks This is the link that users click on to verify their email
   * @returns Void, redirect to '/'
   */
  @Get("verify/email/:token")
  async verifyEmail(@Param() params: { token: string }, @Res() res: Response) {
    const email = jwt.verify(params.token, this.configService.get<string>("JWT_TOKEN")) as { email: string };
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
      res.cookie("verified", true, { expires: new Date(new Date().setSeconds(new Date().getSeconds() + 30)) });
    } else {
      res.cookie("verified", false, { expires: new Date(new Date().setSeconds(new Date().getSeconds() + 30)) });
    }

    return res.redirect("/");
  }

  /**
   * Registers a new user
   *
   * @remarks Throttled to 1 request per 15 minutes
   * @returns Void, HTTP 201 if successful email confirmation, 200 if email disabled
   */
  @Throttle(1, 900)
  @Post("register")
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response): Promise<void> {
    if (
      await this.usersService.user({ email: registerDto.email }) ||
      await this.usersService.user({ username: registerDto.username })
    ) {
      throw new HttpException("Conflict", HttpStatus.CONFLICT);
    } else {
      await this.usersService.createUser({
        username: registerDto.username,
        email: registerDto.email,
        password: await bcrypt.hash(registerDto.password, 10),
        verified: !this.configService.get<boolean>("SMTP_HOST")
      });

      if (await this.mailService.sendEmailConfirmation(registerDto.email)) {
        res.status(201);
      } else {
        res.status(200);
      }
    }
  }

  /*
  * Login routes
  */

  /**
   * Logs a user in and sets relevant cookies
   *
   * @returns Void, HTTP 200 if successful
   */
  @HttpCode(200)
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    if (!(await this.authService.validateUser(loginDto.email, loginDto.password))) {
      throw new UnauthorizedException();
    }

    if (this.configService.get<string>("RECAPTCHA_SECRET")) {
      const captchaCheck = await this.authService.validateRecaptcha(loginDto.recaptchaToken);
      if (!captchaCheck) throw new HttpException("Too many requests", HttpStatus.TOO_MANY_REQUESTS);
    }

    res.cookie("verified", "", { httpOnly: false, expires: new Date() });

    const user = await this.usersService.user({
      email: loginDto.email
    });

    if (!user) {
      throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const refreshToken = this.jwtService.sign({ id: user.id, email: user.email, type: "refresh" }, { expiresIn: "182d" });

    res.cookie("refresh_token", refreshToken, { httpOnly: true, expires: new Date(new Date().setDate(new Date().getDate() + 182)) });
    this.redis.set(user.email, refreshToken);

    res.cookie("access_token", this.jwtService.sign({ id: user.id, email: user.email, type: "access" }, { expiresIn: "15m" }), { httpOnly: true, expires: new Date(new Date().getTime() + 15 * 60000) });
    res.cookie("authenticated", true, { httpOnly: false, expires: new Date(new Date().setDate(new Date().getDate() + 182)) });

    return;
  }

  /**
   * Logs a user out and removes relevant cookies
   *
   * @returns Void
   */
  @Post("logout")
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }
}
