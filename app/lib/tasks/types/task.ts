import type { Timestamp } from 'firebase/firestore';

export interface Task {
  id?: string;
  name: string;
  description: string;
  organizationId: string;
  dueDate: Timestamp;
  isDone: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: string;
}
