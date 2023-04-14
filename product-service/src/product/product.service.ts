import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { ProductDoc } from './interfaces/product-document.interface';
import { Product } from './interfaces/product.interface';
import { ProductDTO } from './dtos/product.dto';

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

  async getByIds(ids: string[]): Promise<Product[]> {
    const _ids = ids.map((id) => new mongoose.Types.ObjectId(id));
    const ProductDocs = await this.productModel
      .find({ _id: { $in: _ids } })
      .exec();
    return ProductDocs.map((doc) => ({
      id: doc._id,
      title: doc.title,
      description: doc.description,
      price: doc.price,
    }));
  }

  async insertOne(product: ProductDTO): Promise<Product> {
    const doc = await this.productModel.create(product);
    return {
      id: doc._id,
      title: doc.title,
      description: doc.description,
      price: doc.price,
    };
  }

  async updateOne(product: ProductDTO): Promise<Product> {
    const { _id } = product;
    const foundProduct = await this.productModel
      .findOneAndUpdate({ _id }, product)
      .exec();
    return {
      id: foundProduct._id,
      title: foundProduct.title,
      description: foundProduct.description,
      price: foundProduct.price,
    };
  }

  deleteOne(id: string) {
    return this.productModel.deleteOne({ id }).exec();
  }
}
