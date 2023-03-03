import { useEffect } from 'react';
import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import { useForm } from 'react-hook-form';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from '@remix-run/react';
import useUpdateTask from '~/lib/tasks/hooks/use-update-task';

const defaultDueDate = new Date();
defaultDueDate.setHours(defaultDueDate.getHours() + 3);

const UpdateTaskForm: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const [updateTask, requestState] = useUpdateTask();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      description: '',
      dueDate: defaultDueDate,
    },
  });

  const nameControl = register('name', { required: true });
  const descriptionControl = register('description', { required: true });
  const dueDateControl = register('dueDate', { required: true });

  const onSubmit = async (name: string, description: string, dueDate: Date) => {
    return toast.promise(
      updateTask(name, description, Timestamp.fromDate(new Date(dueDate))),
      {
        loading: t<string>('task:updateTaskLoading'),
        success: () => {
          navigation(-1);
          return t<string>('task:updateTaskSuccess');
        },
        error: t<string>('task:updateTaskError'),
      }
    );
  };

  // similar to componentDidMount
  useEffect(() => {
    // TODO: call a hook to get the data from the database using the `taskId` prop.
  }, []);

  // similar to componentDidUpdate
  useEffect(() => {
    reset({
      name: '',
      description: '',
      dueDate: defaultDueDate,
    });
  }, [reset]);

  return (
    <form
      className={'space-y-2'}
      data-cy={'update-task-form'}
      onSubmit={handleSubmit((value) => {
        return onSubmit(value.name, value.description, value.dueDate);
      })}
    >
      <TextField>
        <TextField.Label>
          Name
          <TextField.Input
            innerRef={nameControl.ref}
            name={nameControl.name}
            required={nameControl.required}
            onBlur={nameControl.onBlur}
            onChange={nameControl.onChange}
            placeholder="Enter a task name"
            data-cy={'task-name-input'}
          />
        </TextField.Label>
      </TextField>

      <TextField>
        <TextField.Label>
          Description
          <TextField.Input
            innerRef={descriptionControl.ref}
            name={descriptionControl.name}
            required={descriptionControl.required}
            onBlur={descriptionControl.onBlur}
            onChange={descriptionControl.onChange}
            placeholder="Please enter a description"
            data-cy={'task-description-input'}
          />
        </TextField.Label>
      </TextField>

      <TextField>
        <TextField.Label>
          Due date
          <TextField.Input
            type={'datetime-local'}
            innerRef={dueDateControl.ref}
            name={dueDateControl.name}
            required={dueDateControl.required}
            onBlur={dueDateControl.onBlur}
            onChange={dueDateControl.onChange}
            data-cy={'task-due-date-input'}
          />
        </TextField.Label>
      </TextField>

      <Button className="w-full" loading={requestState.loading}>
        <Trans i18nKey={'task:updateTaskSubmitLabel'} />
      </Button>
    </form>
  );
};

export default UpdateTaskForm;
