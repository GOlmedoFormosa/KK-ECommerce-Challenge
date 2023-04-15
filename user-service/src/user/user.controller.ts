import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/:id')
  @ApiExcludeEndpoint()
  async get(@Param('id') id: number) {
    return await this.userService.findOne({ id });
  }
}
