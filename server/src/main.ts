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

  app.use(helmet());

  // Load root .env for CORS default
  if (process.env.NODE_ENV !== 'production' && !process.env.CORS_ORIGIN) {
    process.env.CORS_ORIGIN = 'http://localhost:3000';
  }
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('E-Navbat UZ API')
      .setDescription("O'zbekiston uchun elektron navbat olish tizimi API")
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
  }

  app.getHttpAdapter().get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  });

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
  logger.log(`E-Navbat API ishga tushdi: http://localhost:${port}`);
  logger.log(`Health check: http://localhost:${port}/api/health`);
  logger.log(`CORS origin: ${corsOrigin}`);
}
bootstrap();
