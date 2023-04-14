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
import { ProductCreateDto } from './dtos/product-create.dto';
import { ProductUpdateDto } from './dtos/product-update.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async all(): Promise<Product[]> {
    return this.productService.getAll();
  }

  @Get('summary')
  async summary(): Promise<Partial<Product>[]> {
    return this.productService.getSummary();
  }

  @Post('/ids')
  async getByIds(@Body('ids') ids: string[]): Promise<Product[]> {
    return this.productService.getByIds(ids);
  }

  @Post()
  async create(@Body() product: ProductCreateDto): Promise<Product> {
    return this.productService.insertOne(product);
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() product: ProductUpdateDto,
  ): Promise<Product> {
    return this.productService.updateOne(id, product);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.productService.deleteOne(id);
    return { message: 'success' };
  }
}
