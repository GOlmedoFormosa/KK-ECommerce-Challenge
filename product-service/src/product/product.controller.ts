import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dtos/product-create.dto';
import { ProductUpdateDto } from './dtos/product-update.dto';
import { AuthGuard } from '../auth/auth/auth.guard';

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

  @Get('/:id')
  async get(@Param('id') id: string) {
    return this.productService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() product: ProductCreateDto): Promise<Product> {
    return this.productService.insertOne(product);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() product: ProductUpdateDto,
  ): Promise<Product> {
    return this.productService.updateOne(id, product);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    try {
      await this.productService.deleteOne(id);
      return { message: 'success' };
    } catch (err) {
      return { message: err.message };
    }
  }
}
