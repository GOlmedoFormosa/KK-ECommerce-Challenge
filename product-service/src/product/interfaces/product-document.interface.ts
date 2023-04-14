import { Document } from 'mongoose';

export interface ProductDoc extends Document {
  title: string;
  description: string;
  price: number;
}
