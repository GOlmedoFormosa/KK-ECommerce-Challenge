import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://cart-service:3000',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Product Service')
    .setDescription('Service to create, read, update and delete products.')
    .setVersion('1.0')
    .addCookieAuth('authCookie', {
      type: 'http',
      in: 'Header',
      scheme: 'Bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      methodKey === 'getDocumentation'
        ? 'getProductDocs'
        : `${controllerKey}_${methodKey}`,
  });
  SwaggerModule.setup('api/products/docs', app, document);
  await app.listen(3000);
}
bootstrap();
