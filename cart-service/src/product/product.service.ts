import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Product } from './models/product.entity';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(private httpService: HttpService) {}

  async findOne(id: string) {
    const request = this.httpService
      .get(`http://product-service:3000/api/products/${id}`)
      .pipe(map((response) => response.data));
    const product: Product = await lastValueFrom(request);
    return product;
  }
}
