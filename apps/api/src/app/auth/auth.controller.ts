import { Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from "../providers/database/users/users.service";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { Response, Request } from "express";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { LoginDto, RegisterDto, ResetPasswordDto } from "@scholarsome/shared";

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor (private usersService: UsersService, private authService: AuthService) {}

  /*
  *
  * Password reset routes
  *
  */

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
    return this.authService.sendReset(params.email);
  }

  /*
  *
  * Registration routes
  *
  */

  @Get('verify/email/:token')
  async verifyEmail(@Param() params: { token: string }, @Res() res: Response) {
    return this.authService.verifyEmail(params.token, res);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response): Promise<void> {
    return this.authService.register(registerDto, res);
  }

  /*
  *
  * Login routes
  *
  */

  @Get('authenticated')
  checkToken(@Req() req: Request) {
    return this.authService.checkToken(req);
  }

  @Throttle(1, 600)
  @Post('refresh')
  refreshAccessToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refreshAccessToken(req, res);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.authService.logout(res, req);
  }
}
