import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './product/schemas/product.schema';
import { ProductsSeeder } from './product/seeders/product.seeder';

seeder({
  imports: [
    MongooseModule.forRoot(
      'mongodb://kuantokusta:kuantokusta@product-service-db:27017/kk_products?authSource=admin&readPreference=primary',
    ),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
}).run([ProductsSeeder]);
