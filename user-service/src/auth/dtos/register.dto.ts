import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @ApiProperty({ default: 'first_name', required: true })
  first_name: string;
  @IsNotEmpty()
  @ApiProperty({ default: 'last_name', required: true })
  last_name: string;
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ default: 'mail@mail.com', required: true })
  email: string;
  @IsNotEmpty()
  @ApiProperty({ default: 'password', required: true })
  password: string;
  @IsNotEmpty()
  @ApiProperty({ default: 'password', required: true })
  password_confirm: string;
}
