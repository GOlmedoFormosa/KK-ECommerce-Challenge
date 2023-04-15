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
    origin: 'http://localhost:3200', // URL of the client
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Cart Service')
    .setDescription(
      'Service to get cart, add and remove products to it, and checkout the cart',
    )
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
        ? 'getCartDocs'
        : `${controllerKey}_${methodKey}`,
  });
  SwaggerModule.setup('api/cart/docs', app, document);
  await app.listen(3000);
}
bootstrap();
