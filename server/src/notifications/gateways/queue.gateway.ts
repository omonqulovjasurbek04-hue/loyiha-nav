import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
})
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(QueueGateway.name);

  // ticketId → Set<socketId>
  private readonly ticketRooms = new Map<string, Set<string>>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      client.data.userId = payload.sub;
      client.data.role = payload.role;

      this.logger.log(`WebSocket ulandi: ${client.id} (${payload.sub})`);
    } catch {
      this.logger.warn(`Noto'g'ri token: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    this.ticketRooms.forEach((sockets, ticketId) => {
      sockets.delete(client.id);
      if (sockets.size === 0) this.ticketRooms.delete(ticketId);
    });
    this.logger.log(`WebSocket uzildi: ${client.id}`);
  }

  @SubscribeMessage('join_queue')
  handleJoinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ticket_id: string },
  ): void {
    const { ticket_id } = data;
    client.join(`ticket:${ticket_id}`);

    if (!this.ticketRooms.has(ticket_id)) {
      this.ticketRooms.set(ticket_id, new Set());
    }
    this.ticketRooms.get(ticket_id)!.add(client.id);

    this.logger.log(`${client.id} → ticket:${ticket_id} roomga qo'shildi`);
  }

  @SubscribeMessage('leave_queue')
  handleLeaveQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ticket_id: string },
  ): void {
    const { ticket_id } = data;
    client.leave(`ticket:${ticket_id}`);
    this.ticketRooms.get(ticket_id)?.delete(client.id);
  }

  async callTicket(
    ticketId: string,
    ticketNumber: number,
    windowNumber: number,
  ): Promise<void> {
    this.server.to(`ticket:${ticketId}`).emit('ticket_called', {
      ticket_number: ticketNumber,
      window_number: windowNumber,
      message: `${windowNumber}-oynaga o'ting`,
    });
  }

  async broadcastQueueUpdate(queueId: string): Promise<void> {
    this.server.to(`queue:${queueId}`).emit('queue_update', {
      queue_id: queueId,
      updated_at: new Date().toISOString(),
    });
  }
}
