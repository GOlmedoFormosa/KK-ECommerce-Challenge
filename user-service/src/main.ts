import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
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
    .setTitle('Auth Service')
    .setDescription('Service to register and authenticate users')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      methodKey === 'getDocumentation'
        ? 'getUserDocs'
        : `${controllerKey}_${methodKey}`,
  });
  SwaggerModule.setup('api/auth/docs', app, document);
  await app.listen(3000);
}
bootstrap();
