import { Body, Controller, Get, HttpCode, Param, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from "../providers/database/users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";
import { ThrottlerGuard } from "@nestjs/throttler";

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor (private usersService: UsersService, private authService: AuthService) {}

  @Get('verify/:token')
  async verify(@Param() params: { token: string }, @Res() res: Response) {
    return this.authService.verifyUserEmail(params.token, res);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.registerUser(registerDto);
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
