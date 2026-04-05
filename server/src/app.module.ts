import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { QueuesModule } from './queues/queues.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    // Environment sozlash
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production'
        ? '.env.production'
        : '.env',
      load: [databaseConfig, redisConfig],
    }),

    // Database ulanish — production da DATABASE_URL, dev da alohida parametrlar
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        const databaseUrl = configService.get<string>('DATABASE_URL');

        // Production da DATABASE_URL ishlatiladi (Railway beradi)
        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            ssl: isProduction ? { rejectUnauthorized: false } : false,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: !isProduction, // Production da false — migration ishlat!
            logging: !isProduction,
          };
        }

        // Development da alohida parametrlar
        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USER', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_NAME', 'enavbat'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),

    // Rate limiting: 100 so'rov / 1 daqiqa
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Modullar
    UsersModule,
    OrganizationsModule,
    QueuesModule,
    AuthModule,
  ],
  providers: [
    // Global rate limit guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
