import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from './cart/cart.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
