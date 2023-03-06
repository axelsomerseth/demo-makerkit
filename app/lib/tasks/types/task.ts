import type { Timestamp } from 'firebase/firestore';

export interface Task {
  id?: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  done: boolean;
  organizationId: string;
  createdAt?: Timestamp;
  updateAt?: Timestamp;
  createdBy?: string;
}
