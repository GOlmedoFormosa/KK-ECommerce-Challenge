import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  transaction_id: string;

  @Column()
  user_id: number;

  @Column({ default: false })
  @Exclude()
  completed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CartItem, (cart_item) => cart_item.cart)
  cart_items: CartItem[];

  @Expose()
  get totalQuantity() {
    return this.cart_items.reduce((acc, i) => acc + i.quantity, 0);
  }

  @Expose()
  get totalPrice() {
    return this.cart_items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  }
}
