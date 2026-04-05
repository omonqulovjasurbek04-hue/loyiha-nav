import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { QueueGateway } from './gateways/queue.gateway';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [QueueGateway],
  exports: [QueueGateway],
})
export class NotificationsModule {}
