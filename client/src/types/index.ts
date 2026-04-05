export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: string;
  phone: string;
  full_name: string;
  passport_series?: string;
  birth_date?: string;
  role: 'citizen' | 'operator' | 'admin' | 'superadmin';
  is_active: boolean;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'government' | 'private' | 'medical' | 'education' | 'bank';
  address: string;
  district: string;
  working_hours: {
    mon_fri: { open: string; close: string };
    saturday: { open: string; close: string } | null;
    sunday: { open: string; close: string } | null;
  };
  is_active: boolean;
}

export interface Service {
  id: string;
  org_id: string;
  name: string;
  duration_minutes: number;
  daily_limit: number;
  is_active: boolean;
}

export type TicketStatus =
  | 'waiting'
  | 'called'
  | 'in_progress'
  | 'completed'
  | 'skipped'
  | 'cancelled';

export interface Ticket {
  id: string;
  ticket_number: number;
  status: TicketStatus;
  window_number?: number;
  issued_at: string;
  called_at?: string;
  completed_at?: string;
  service: Service;
  queue: Queue;
}

export interface Queue {
  id: string;
  service_id: string;
  date: string;
  current_number: number;
  total_issued: number;
}

export interface QueueUpdate {
  ticket_number: number;
  position: number;
  waiting_count: number;
  estimated_wait: number;
}
