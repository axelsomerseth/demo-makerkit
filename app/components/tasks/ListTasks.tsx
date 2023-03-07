import TaskCard from './TaskCard';
import { Timestamp } from 'firebase/firestore';

import type { Task } from '~/lib/tasks/types/task';

const SAMPLE_DATA: Task[] = [
  {
    id: 'some-crazy-id',
    title: 'Test Title',
    description: 'Test description',
    done: false,
    dueDate: Timestamp.fromDate(
      new Date('Wed Mar 07 2023 13:26:00 GMT-0600 (Central Standard Time)')
    ),
    createdAt: Timestamp.fromDate(
      new Date('Tue Mar 07 2023 10:26:29 GMT-0600 (Central Standard Time)')
    ),
    organizationId: 'jpbCRSjRqW7IddsaKomZ',
    createdBy: 'GTnTA2OswQht8Ymie27J1hs4FqJE',
  },
];

const ListTasks: React.FC<{}> = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {SAMPLE_DATA.map((task) => {
        return <TaskCard key={task.id} task={task} />;
      })}
    </div>
  );
};

export default ListTasks;
