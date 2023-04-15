import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ default: 'mail@mail.com', required: true })
  email: string;
  @IsNotEmpty()
  @ApiProperty({ default: 'password', required: true })
  password: string;
}
