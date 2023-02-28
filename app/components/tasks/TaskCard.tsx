import { Switch } from '@headlessui/react';
import { useEffect, useState } from 'react';
import SubHeading from '~/core/ui/SubHeading';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import IconButton from '~/core/ui/IconButton';

const TaskCard: React.FCC<{
  name: string;
  description: string;
  dueDate: Date;
  isDone: boolean;
  createdAt: Date;
  updatedAt?: Date;
  createdBy: string;
}> = ({ name, description, dueDate, isDone, createdAt, createdBy }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(() => isDone);
  }, [isDone]);

  return (
    <div className="ml-2 mr-2 flex justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow dark:border-black-400 dark:border-gray-600 dark:bg-black-500 dark:shadow">
      <div className="flex-initial">
        <SubHeading>{name}</SubHeading>
        <p>{description}</p>
        {/* TODO: Due Date */}
        {/* TODO: Created At */}
        {/* TODO: Created By (maybe) */}
      </div>
      <div className="flex-initial">
        <div className="flex flex-col items-center space-y-3">
          <div className="mt-2 mb-2">
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={`${
                enabled ? 'bg-primary-500' : 'bg-gray-400'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
          <IconButton>
            <PencilIcon className="h-6" />
          </IconButton>
          <IconButton>
            <TrashIcon className="h-6" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
