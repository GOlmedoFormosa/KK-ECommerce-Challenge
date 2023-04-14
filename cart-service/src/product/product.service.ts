import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Product } from './models/product.entity';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(private httpService: HttpService) {}

  async findOne(id: string) {
    const product: Product = await lastValueFrom(
      this.httpService
        .get(`http://localhost:8010/api/products/${id}`)
        .pipe(map((response) => response.data)),
    );
    return product;
  }
}
