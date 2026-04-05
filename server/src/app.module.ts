import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from '@nestjs-modules/ioredis';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { QueuesModule } from './queues/queues.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { OperatorsModule } from './operators/operators.module';
import { User } from './users/entities/user.entity';
import { Organization } from './organizations/entities/organization.entity';
import { Service } from './organizations/entities/service.entity';
import { Queue } from './queues/entities/queue.entity';
import { Ticket } from './queues/entities/ticket.entity';
import { Operator } from './users/entities/operator.entity';
import { Notification } from './users/entities/notification.entity';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production'
        ? path.resolve(process.cwd(), '.env.production')
        : path.resolve(process.cwd(), '.env'),
    }),

    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        return {
          type: 'single',
          url: redisUrl,
          options: {
            retryStrategy: (times: number) => {
              if (times > 3) return null;
              return 1000;
            },
            maxRetriesPerRequest: isProduction ? 3 : null,
          },
        };
      },
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            ssl: isProduction ? { rejectUnauthorized: false } : false,
            entities: [User, Organization, Service, Queue, Ticket, Operator, Notification],
            synchronize: !isProduction,
            logging: !isProduction,
            retryAttempts: 3,
            retryDelay: 3000,
            poolSize: isProduction ? 20 : 10,
          };
        }

        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USER', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_NAME', 'enavbat'),
          entities: [User, Organization, Service, Queue, Ticket, Operator, Notification],
          synchronize: true,
          logging: false,
          retryAttempts: 3,
          retryDelay: 3000,
          poolSize: 10,
        };
      },
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    NotificationsModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    QueuesModule,
    AdminModule,
    OperatorsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
