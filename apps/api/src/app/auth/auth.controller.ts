import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";
import { AuthenticatedGuard } from "./authenticated.guard";

@Controller('auth')
export class AuthController {
  constructor (private usersService: UsersService, private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    return this.authService.registerUser(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.authenticateUser(loginDto, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logoutUser(res);
  }

  @UseGuards(AuthenticatedGuard)
  @Post('test')
  async test() {
    return true;
  }
}
