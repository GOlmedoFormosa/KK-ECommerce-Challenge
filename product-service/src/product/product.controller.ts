import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { ProductService } from './product.service';
import { ProductDTO } from './dtos/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async all(): Promise<Product[]> {
    return this.productService.getAll();
  }

  @Get('/:ids')
  async getById(@Param('ids') ids: string | string[]): Promise<Product[]> {
    const arrIds = [].concat(ids);
    return this.productService.getByIds(arrIds);
  }

  @Get('summary')
  async summary(): Promise<Partial<Product>[]> {
    return this.productService.getSummary();
  }

  @Post()
  async create(@Body() product: ProductDTO): Promise<Product> {
    return this.productService.insertOne(product);
  }

  @Patch()
  async update(@Body() product: ProductDTO): Promise<Product> {
    return this.productService.updateOne(product);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<unknown> {
    return this.productService.deleteOne(id);
  }
}
