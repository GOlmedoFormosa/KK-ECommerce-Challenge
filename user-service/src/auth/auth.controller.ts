import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { RegisterDto } from './dtos/register.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { password_confirm, ...data } = body;
    if (body.password !== password_confirm) {
      throw new BadRequestException('Password do not match!');
    }
    const passHashed = await bcrypt.hash(body.password, 12);
    return this.userService.save({
      ...data,
      password: passHashed,
    });
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    const jwt = await this.jwtService.signAsync({
      id: user.id,
    });

    response.cookie('jwt', jwt, { httpOnly: true });
    return {
      message: 'success',
      user: {
        ...user,
        password: undefined,
      },
    };
  }

  @Get('user')
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    return this.userService.findOne({ id: data['id'] });
  }
}
