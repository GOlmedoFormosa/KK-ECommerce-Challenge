import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://kuantokusta:kuantokusta@product-service-db:27017/kk_products?authSource=admin&readPreference=primary',
    ),
    ProductModule,
    AuthModule,
  ],
})
export class AppModule {}
