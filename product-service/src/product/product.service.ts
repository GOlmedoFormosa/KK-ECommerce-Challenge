import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { ProductDoc } from './interfaces/product-document.interface';
import { Product } from './interfaces/product.interface';
import { ProductCreateDto } from './dtos/product-create.dto';
import { ProductUpdateDto } from './dtos/product-update.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductDoc>,
  ) {}

  async getAll(): Promise<Product[]> {
    const ProductDocs = await this.productModel.find().exec();
    return ProductDocs.map((doc) => ({
      id: doc._id,
      title: doc.title,
      description: doc.description,
      price: doc.price,
    }));
  }

  async getSummary(): Promise<Partial<Product>[]> {
    const ProductDocs = await this.productModel.find().exec();
    return ProductDocs.map((doc) => ({
      id: doc._id,
      price: doc.price,
    }));
  }

  async findOne(id) {
    const doc = await this.productModel.findById(
      new mongoose.Types.ObjectId(id),
    );
    return {
      id: doc._id,
      title: doc.title,
      description: doc.description,
      price: doc.price,
    };
  }

  async insertOne(product: ProductCreateDto): Promise<Product> {
    const doc = await this.productModel.create(product);
    return {
      id: doc._id,
      title: doc.title,
      description: doc.description,
      price: doc.price,
    };
  }

  async updateOne(id: string, product: ProductUpdateDto): Promise<Product> {
    await this.productModel.findOneAndUpdate({ _id: id }, product).exec();
    const foundProduct = await this.productModel.findById(id).exec();
    return {
      id: foundProduct._id,
      title: foundProduct.title,
      description: foundProduct.description,
      price: foundProduct.price,
    };
  }

  deleteOne(id: string) {
    return this.productModel.findByIdAndRemove(id).exec();
  }
}
