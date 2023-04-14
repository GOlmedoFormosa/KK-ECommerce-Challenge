import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { RegisterDto } from './dtos/register.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}
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
}
