import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import { useForm } from 'react-hook-form';
import { useContext, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import useCreateTask from '~/lib/tasks/hooks/use-create-task';
import OrganizationContext from '~/lib/contexts/organization';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const CreateTaskForm: React.FC<{}> = () => {
  const defaultDueDate = new Date();
  defaultDueDate.setHours(defaultDueDate.getHours() + 3);

  const { organization } = useContext(OrganizationContext);
  const { t } = useTranslation();
  const [createTask, requestState] = useCreateTask();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      description: '',
      organizationId: organization?.id as string,
      dueDate: Timestamp.fromDate(defaultDueDate),
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
    dueDate: Timestamp,
    isDone: boolean
  ) => {
    // TODO: fill in this function to submit the form.
    console.log({
      name,
      description,
      organizationId,
      dueDate,
      isDone,
    });
    return toast.promise(
      createTask(name, description, organizationId, dueDate, isDone),
      {
        loading: t<string>('task:createTaskLoading'),
        success: t<string>('task:createTaskSuccess'),
        error: t<string>('task:createTaskError'),
      }
    );
  };

  useEffect(() => {
    reset({
      name: '',
      description: '',
      organizationId: organization?.id as string,
      dueDate: Timestamp.now(),
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
            placeholder="name"
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
            placeholder="description"
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
            placeholder="due date"
            data-cy={'task-due-date-input'}
          />
        </TextField.Label>
      </TextField>

      <Button className="w-full">Create Task</Button>
    </form>
  );
};

export default CreateTaskForm;
