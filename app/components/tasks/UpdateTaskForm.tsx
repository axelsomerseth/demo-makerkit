import { useEffect } from 'react';
import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import { useForm } from 'react-hook-form';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from '@remix-run/react';
import useUpdateTask from '~/lib/tasks/hooks/use-update-task';
import useReadTask from '~/lib/tasks/hooks/use-read-task';
import If from '~/core/ui/If';
import SubHeading from '~/core/ui/SubHeading';

const defaultDueDate = new Date();
defaultDueDate.setHours(defaultDueDate.getHours() + 3);

const UpdateTaskForm: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const { data: task, error, status } = useReadTask(taskId);
  const [updateTask, requestState] = useUpdateTask();
  const { register, handleSubmit, reset, setValue } = useForm({
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

  useEffect(() => {
    reset({
      name: '',
      description: '',
      dueDate: defaultDueDate,
    });
  }, [reset]);

  if (status === 'success') {
    console.log(task?.dueDate.toDate());
    setValue('name', task?.name);
    setValue('description', task?.description);
    setValue('dueDate',new Date( task?.dueDate.toDate().toISOString()));
  }

  return (
    <>
      <If condition={status === 'loading'}>
        <SubHeading>Loading...</SubHeading>
      </If>
      <If condition={status === 'error'}>
        <SubHeading> An error has occured</SubHeading>
        <p>{error?.message}</p>
      </If>
      <If condition={status === 'success'}>
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
      </If>
    </>
  );
};

export default UpdateTaskForm;
