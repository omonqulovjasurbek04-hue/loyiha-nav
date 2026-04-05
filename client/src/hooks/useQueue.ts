import { useEffect, useState, useCallback } from 'react';
import { getSocket } from '@/lib/socket';
import { QueueUpdate } from '@/types/index';

export function useQueue(ticketId: string | null) {
  const [position, setPosition] = useState<number | null>(null);
  const [waitingCount, setWaitingCount] = useState<number>(0);
  const [estimatedWait, setEstimatedWait] = useState<number>(0);
  const [status, setStatus] = useState<string>('WAITING');
  const [windowNumber, setWindowNumber] = useState<number | null>(null);

  const joinQueue = useCallback(() => {
    if (!ticketId) return;
    const socket = getSocket();
    socket.emit('join_queue', { ticket_id: ticketId });
  }, [ticketId]);

  const leaveQueue = useCallback(() => {
    if (!ticketId) return;
    const socket = getSocket();
    socket.emit('leave_queue', { ticket_id: ticketId });
  }, [ticketId]);

  useEffect(() => {
    if (!ticketId) return;

    const socket = getSocket();

    socket.emit('join_queue', { ticket_id: ticketId });

    const handleQueueUpdate = (data: QueueUpdate) => {
      setPosition(data.position);
      setWaitingCount(data.waiting_count);
      setEstimatedWait(data.estimated_wait);
    };

    const handleTicketCalled = (data: any) => {
      setStatus('CALLED');
      setWindowNumber(data.window_number);
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('E-Navbat UZ', {
            body: `${data.window_number}-oynaga o'ting!`,
            icon: '/icon.png',
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      }
    };

    const handleTicketSkipped = () => {
      setStatus('SKIPPED');
    };

    socket.on('queue_update', handleQueueUpdate);
    socket.on('ticket_called', handleTicketCalled);
    socket.on('ticket_skipped', handleTicketSkipped);

    return () => {
      socket.off('queue_update', handleQueueUpdate);
      socket.off('ticket_called', handleTicketCalled);
      socket.off('ticket_skipped', handleTicketSkipped);
      socket.emit('leave_queue', { ticket_id: ticketId });
    };
  }, [ticketId]);

  return { 
    position, 
    waitingCount, 
    estimatedWait, 
    status, 
    windowNumber,
    joinQueue, 
    leaveQueue 
  };
}
