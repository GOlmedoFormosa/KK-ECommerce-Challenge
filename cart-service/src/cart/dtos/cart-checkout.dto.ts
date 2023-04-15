import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CartCheckoutDto {
  @IsNotEmpty()
  @ApiProperty({ default: 1, required: true })
  cart_id: number;
}
