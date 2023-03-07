import { useState } from 'react';
import { Switch } from '@headlessui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import IconButton from '~/core/ui/IconButton';
import { formatDistance } from 'date-fns';

import type { Task } from '~/lib/tasks/types/task';

const TaskCard: React.FCC<{ task: Task }> = ({ task }) => {
  const [enabled, setEnabled] = useState(task.done);

  return (
    <div className="m-3 rounded-lg shadow-lg">
      <div className="flex justify-between">
        <div className="m-5 flex-initial">
          <div className="flex flex-col">
            <div className="flex-initial">
              <span
                className={
                  (enabled ? 'line-through ' : '') + 'text-lg font-semibold'
                }
              >
                {task.title}
              </span>
            </div>
            <div className="flex-initial">
              <span
                className={
                  (enabled ? 'line-through ' : '') + 'text-sm font-normal'
                }
              >
                {task.description}
              </span>
            </div>
            <div className="flex-initial">
              <span
                className={
                  (enabled ? 'line-through ' : '') + 'text-sm font-normal'
                }
              >
                {'Due ' +
                  formatDistance(task.dueDate.toDate(), new Date(), {
                    addSuffix: true,
                  })}
              </span>
            </div>
            <div className="flex-initial">
              <span className="text-sm font-normal italic">
                {'Created ' +
                  formatDistance(task.createdAt?.toDate() as Date, new Date(), {
                    addSuffix: true,
                  })}
              </span>
            </div>
          </div>
        </div>
        <div className="ml-5 mr-5 mt-3 mb-3 flex-initial">
          <div className="flex h-full flex-col items-center justify-between">
            <div className="flex-initial space-y-1">
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${
                  enabled ? 'bg-primary-500' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span
                  className={`${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
            <div className="flex-initial">
              <IconButton>
                <PencilIcon className={'h-6'} />
              </IconButton>
            </div>
            <div className="flex-initial">
              <IconButton>
                <TrashIcon className={'h-6'} />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
