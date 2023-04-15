import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomInt } from 'crypto';
import { Factory } from 'nestjs-seeder';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Factory((faker) => faker.lorem.words(5))
  @Prop()
  title: string;
  @Factory((faker) => faker.lorem.words(12))
  @Prop()
  description: string;
  @Factory(() => randomInt(10, 100))
  @Prop()
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
