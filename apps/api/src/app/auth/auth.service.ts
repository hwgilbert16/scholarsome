import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from "../providers/database/users/users.service";
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  logoutUser(res: Response): void {
    res.cookie('access_token', '', { httpOnly: true, expires: new Date() });
    res.cookie('authenticated', '', { httpOnly: false, expires: new Date() });

    return res.redirect('/');
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.usersService.user({
      email
    });

    return !!(await bcrypt.compare(password, user.password));
  }

  authenticateUser(loginDto: LoginDto, res: Response): Promise<void> {
    res.cookie('access_token', this.jwtService.sign({ email: loginDto.email }), { httpOnly: true, expires: new Date(new Date().setDate(new Date().getDate() + 14)) })
    res.cookie('authenticated', true, { httpOnly: false, expires: new Date(new Date().setDate(new Date().getDate() + 14)) })
    return;
  }

  async registerUser(registerDto: RegisterDto) {
    if (await this.usersService.user({ email: registerDto.email })) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    } else {
      await this.usersService.createUser({
        username: registerDto.username,
        email: registerDto.email,
        password: await bcrypt.hash(registerDto.password, 10),
      })
    }
  }
}
