import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './models/cart-item.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async save(options) {
    return this.cartItemRepository.save(options);
  }

  async findOne({ options, relations }) {
    return this.cartItemRepository.findOne({
      where: options,
      relations,
    });
  }

  async delete(id: number): Promise<unknown> {
    return this.cartItemRepository.delete(id);
  }
}
