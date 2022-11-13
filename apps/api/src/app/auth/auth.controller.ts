import { Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from "../providers/database/users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { Response, Request } from "express";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { ResetPasswordDto } from "./dto/reset.dto";

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor (private usersService: UsersService, private authService: AuthService) {}

  @Get('verify/email/:token')
  async verify(@Param() params: { token: string }, @Res() res: Response) {
    return this.authService.verifyUserEmail(params.token, res);
  }

  @Post('reset/password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.authService.resetPassword(resetPasswordDto, res, req);
  }

  @Get('reset/password/setCookie/:token')
  async setResetCookie(@Param() params: { token: string }, @Res() res: Response) {
    return this.authService.setResetCookie(params.token, res);
  }

  @Throttle(1, 600)
  @Get('reset/password/:email')
  async sendReset(@Param() params: { email: string }) {
    return this.authService.sendPasswordReset(params.email);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response): Promise<void> {
    return this.authService.registerUser(registerDto, res);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.authenticateUser(loginDto, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logoutUser(res);
  }
}
