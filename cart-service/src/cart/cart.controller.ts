import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemService } from './cart-item.service';
import { CartItemDto } from './dtos/cart-item.dto';
import { ProductService } from 'src/product/product.service';
import { randomInt } from 'crypto';
import { Cart } from './models/cart.entity';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/auth/auth.guard';

@Controller('carts')
@UseInterceptors(ClassSerializerInterceptor)
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}
  @Get('/:user_id')
  async get(@Param('user_id') user_id: number) {
    if (!user_id) {
      throw new BadRequestException('The user id is required');
    }
    const user = await this.userService.findOne(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const cart = await this.cartService.findOne({
      options: { user_id, completed: false },
      relations: ['cart_items'],
    });
    if (cart) {
      return cart;
    }
    const new_cart: Cart = await this.cartService.save({
      user_id,
    });
    new_cart.cart_items = [];
    return new_cart;
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
    if (cartItem?.cart && cartItem.cart.completed) {
      throw new BadRequestException('This cart is already completed');
    }
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

    if (cartItem?.cart && cartItem.cart.completed) {
      throw new BadRequestException('This cart is already completed');
    }

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
  @UseGuards(AuthGuard)
  @Post('checkout')
  async checkout(@Body('cart_id') cart_id: number) {
    if (!cart_id) {
      throw new BadRequestException('The cart id is required');
    }
    const cart = await this.cartService.findOne({
      options: { id: cart_id, completed: false },
      relations: ['cart_items'],
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (cart.completed) {
      throw new BadRequestException('This cart is already completed');
    }

    if (cart.cart_items.length <= 0) {
      throw new BadRequestException('The cart must have at least one product');
    }
    cart.transaction_id = randomInt(10000).toString();
    cart.completed = true;
    await this.cartService.save(cart);
    return cart;
  }
}
