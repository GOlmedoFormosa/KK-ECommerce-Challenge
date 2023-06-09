import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

import { RegisterDto } from './dtos/register.dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from './auth/auth.guard';
import { LoginDto } from './dtos/login.dto';

@UseInterceptors(ClassSerializerInterceptor)
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
    const newUser = await this.userService.save({
      ...data,
      password: passHashed,
    });
    return {
      ...newUser,
      password: undefined,
    };
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body;
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

  @UseGuards(AuthGuard)
  @Get('authorize')
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    return this.userService.findOne({ id: data['id'] });
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'Success',
    };
  }
}
