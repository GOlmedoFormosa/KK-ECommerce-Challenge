import { IsNotEmpty } from 'class-validator';

export class CartItemDto {
  @IsNotEmpty()
  product_id: string;
  @IsNotEmpty()
  cart_id: number;
}
