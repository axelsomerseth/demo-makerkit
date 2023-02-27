import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import { useForm } from 'react-hook-form';
import { useContext, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import useCreateTask from '~/lib/tasks/hooks/use-create-task';
import OrganizationContext from '~/lib/contexts/organization';
import { toast } from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from '@remix-run/react';

const defaultDueDate = new Date();
defaultDueDate.setHours(defaultDueDate.getHours() + 3);

const CreateTaskForm: React.FC<{}> = () => {
  const { organization } = useContext(OrganizationContext);
  const { t } = useTranslation();
  const navigation = useNavigate();
  const [createTask, requestState] = useCreateTask();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      description: '',
      organizationId: organization?.id as string,
      dueDate: defaultDueDate,
      isDone: false,
    },
  });

  const nameControl = register('name', { required: true });
  const descriptionControl = register('description', { required: true });
  const dueDateControl = register('dueDate', { required: true });

  const onSubmit = async (
    name: string,
    description: string,
    organizationId: string,
    dueDate: Date,
    isDone: boolean
  ) => {
    return toast.promise(
      createTask(
        name,
        description,
        organizationId,
        Timestamp.fromDate(new Date(dueDate)),
        isDone
      ),
      {
        loading: t<string>('task:createTaskLoading'),
        success: () => {
          navigation(-1);
          return t<string>('task:createTaskSuccess');
        },
        error: t<string>('task:createTaskError'),
      }
    );
  };

  useEffect(() => {
    reset({
      name: '',
      description: '',
      organizationId: organization?.id as string,
      dueDate: defaultDueDate,
      isDone: false,
    });
  }, [reset, organization?.id]);

  return (
    <form
      className={'space-y-2'}
      data-cy={'create-task-form'}
      onSubmit={handleSubmit((value) => {
        return onSubmit(
          value.name,
          value.description,
          value.organizationId,
          value.dueDate,
          value.isDone
        );
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
        <Trans i18nKey={"task:createTaskSubmitLabel"}/>
      </Button>
    </form>
  );
};

export default CreateTaskForm;
