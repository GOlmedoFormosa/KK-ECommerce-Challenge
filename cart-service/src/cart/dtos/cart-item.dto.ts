import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CartItemDto {
  @IsNotEmpty()
  @ApiProperty({ default: 'uuid from product', required: true })
  product_id: string;
  @IsNotEmpty()
  @ApiProperty({ default: 1, required: true })
  cart_id: number;
}
