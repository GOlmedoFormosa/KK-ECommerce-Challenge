import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder, DataFactory } from 'nestjs-seeder';

import { Product } from '../schemas/product.schema';

@Injectable()
export class ProductsSeeder implements Seeder {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async seed(): Promise<any> {
    const prods = await this.productModel.find();
    if (prods.length > 0) {
      return;
    }

    // Generate 10 products.
    const products = DataFactory.createForClass(Product).generate(10);

    // Insert into the database.
    return this.productModel.insertMany(products);
  }

  async drop(): Promise<any> {
    return this.productModel.deleteMany({});
  }
}
