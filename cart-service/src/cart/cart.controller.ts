import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemService } from './cart-item.service';
import { CartItemDto } from './dtos/cart-item.dto';
import { ProductService } from 'src/product/product.service';

@Controller('carts')
@UseInterceptors(ClassSerializerInterceptor)
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
  ) {}
  @Get('/:userId')
  async get(@Param('userId') userId: number) {
    if (!userId) {
      throw new BadRequestException('The user id is required');
    }
    const cart = await this.cartService.findOne({
      options: { user_id: userId, completed: false },
      relations: ['cart_items'],
    });
    if (cart) {
      return cart;
    }
    return await this.cartService.save({
      user_id: userId,
    });
  }

  @Post('add')
  async addProduct(@Body() body: CartItemDto) {
    const cartItem = await this.cartItemService.findOne({
      options: {
        cart: { id: body.cart_id },
        product_id: body.product_id,
      },
      relations: ['cart', 'cart.cart_items'],
    });
    if (cartItem) {
      cartItem.quantity += 1;
      await this.cartItemService.save(cartItem);
    } else {
      const product = await this.productService.findOne(body.product_id);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      await this.cartItemService.save({
        cart: { id: body.cart_id },
        product_id: product.id,
        price: product.price,
        quantity: 1,
      });
    }
    return this.cartService.findOne({
      options: { id: body.cart_id },
      relations: ['cart_items'],
    });
  }

  @Post('remove')
  async removeProduct(@Body() body: CartItemDto) {
    const cartItem = await this.cartItemService.findOne({
      options: {
        cart: { id: body.cart_id },
        product_id: body.product_id,
      },
      relations: ['cart'],
    });
    if (cartItem && cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await this.cartItemService.save(cartItem);
    } else if (cartItem) {
      await this.cartItemService.delete(cartItem.id);
    }
    return this.cartService.findOne({
      options: { id: body.cart_id },
      relations: ['cart_items'],
    });
  }
}
