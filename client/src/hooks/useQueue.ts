import { useEffect, useState } from 'react';
import { socketService } from '../lib/socket';
import { QueueUpdate, TicketStatus } from '../types/index';

export function useQueue(ticketId: string) {
  const [position, setPosition] = useState<number | null>(null);
  const [waitingCount, setWaitingCount] = useState<number>(0);
  const [estimatedWait, setEstimatedWait] = useState<number>(0);
  const [status, setStatus] = useState<TicketStatus>('waiting');

  useEffect(() => {
    if (!ticketId) return;

    const socket = socketService.connect();

    // Jonli navbatga qo'shilish
    socket.emit('join_queue', { ticket_id: ticketId });

    // Holat yangilanishini kutish
    const handleQueueUpdate = (data: QueueUpdate) => {
      setPosition(data.position);
      setWaitingCount(data.waiting_count);
      setEstimatedWait(data.estimated_wait);
    };

    const handleTicketCalled = (data: any) => {
      setStatus('called');
      // Browser notification chiqarish
      if (Notification.permission === 'granted') {
        new Notification('Sizning navbatingiz keldi!', {
          body: `Iltimos ${data.window_number}-darachaga keling.`,
        });
      }
    };

    const handleTicketExpired = () => {
      setStatus('skipped');
    };

    socket.on('queue_update', handleQueueUpdate);
    socket.on('ticket_called', handleTicketCalled);
    socket.on('ticket_expired', handleTicketExpired);

    return () => {
      socket.off('queue_update', handleQueueUpdate);
      socket.off('ticket_called', handleTicketCalled);
      socket.off('ticket_expired', handleTicketExpired);
    };
  }, [ticketId]);

  return { position, waitingCount, estimatedWait, status };
}
