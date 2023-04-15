import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ProductCreateDto {
  @IsNotEmpty()
  @ApiProperty({ default: 'test title', required: true })
  title: string;
  @IsNotEmpty()
  @ApiProperty({ default: 'test description', required: true })
  description: string;
  @IsNotEmpty()
  @ApiProperty({ default: 100, required: true })
  price: number;
}
