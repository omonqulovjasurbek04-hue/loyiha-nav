import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Operator } from './entities/operator.entity';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Operator, Notification])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService], // Auth module ulanishi (Repository injection) uchun eksport
})
export class UsersModule {}
