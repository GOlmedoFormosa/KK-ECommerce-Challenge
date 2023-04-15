import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'cart-service-db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'kk_carts',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CartModule,
    ProductModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
