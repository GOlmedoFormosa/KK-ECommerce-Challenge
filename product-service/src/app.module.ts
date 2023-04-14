import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://product-service-db:27017')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
