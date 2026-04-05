import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminAuthController } from './admin-auth.controller';
import { Organization } from '../organizations/entities/organization.entity';
import { Service } from '../organizations/entities/service.entity';
import { User } from '../users/entities/user.entity';
import { Ticket } from '../queues/entities/ticket.entity';
import { Queue } from '../queues/entities/queue.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, Service, User, Ticket, Queue]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AdminController, AdminAuthController],
  providers: [AdminService],
})
export class AdminModule {}
