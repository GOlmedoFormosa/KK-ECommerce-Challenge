import { Injectable } from '@nestjs/common';
import { Cart } from './models/cart.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
  ) {}

  async save(options) {
    return this.cartRepository.save(options);
  }

  async findOne({ options, relations }) {
    return this.cartRepository.findOne({
      where: options,
      relations,
    });
  }
}
