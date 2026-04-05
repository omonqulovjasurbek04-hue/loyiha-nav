import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { IoAdapter } from '@nestjs/platform-socket.io';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Xavfsizlik headerlar (XSS, clickjacking himoyasi)
  app.use(helmet());

  // CORS sozlash — faqat ruxsat etilgan frontend dan
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3001';
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Socket.IO CORS ham to'g'ri sozlanishi kerak
  app.useWebSocketAdapter(new IoAdapter(app));

  // Global prefix: /api
  app.setGlobalPrefix('api');

  // Global ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global HttpExceptionFilter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Response Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger sozlash — /api/docs da
  const config = new DocumentBuilder()
    .setTitle('E-Navbat UZ API')
    .setDescription('O\'zbekiston uchun elektron navbat olish tizimi API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autentifikatsiya')
    .addTag('organizations', 'Idoralar')
    .addTag('tickets', 'Navbat chiptalari')
    .addTag('queue', 'Jonli navbat')
    .addTag('users', 'Foydalanuvchilar')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`E-Navbat API ishga tushdi: http://localhost:${port}`);
  logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
  logger.log(`CORS origin: ${corsOrigin}`);
}
bootstrap();
