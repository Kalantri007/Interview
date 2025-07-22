export interface Worker {
  id: number;
  name: string;
  status: number;
}

export interface Workplace {
  id: number;
  name: string;
  status: number;
}

export interface Shift {
  id: number;
  createdAt: string;
  startAt: string;
  endAt: string;
  workplaceId: number;
  workerId: number | null;
  cancelledAt: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: { next?: string };
}
