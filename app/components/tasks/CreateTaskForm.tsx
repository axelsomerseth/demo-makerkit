import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import useCreateTask from '~/lib/tasks/types/hooks/use-create-task';
import setDatetimeLocal from './datetime';
import OrganizationContext from '~/lib/contexts/organization';
import toast from 'react-hot-toast';
import { useNavigate } from '@remix-run/react';

const defaultDueDate = new Date();
defaultDueDate.setDate(defaultDueDate.getDate() + 1);

const CreateTaskForm: React.FC<{}> = () => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const [createTask, requestState] = useCreateTask();
  const { organization } = useContext(OrganizationContext);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      dueDate: setDatetimeLocal(defaultDueDate),
      done: false,
      organizationId: '',
    },
  });

  // ControlledInputs
  const titleControl = register('title', { required: true });
  const descriptionControl = register('description', { required: true });
  const dueDateControl = register('dueDate', { required: true });

  const onSubmit = (
    title: string,
    description: string,
    dueDate: string,
    done: boolean
  ) => {
    const promise = createTask(
      title,
      description,
      new Date(dueDate),
      done,
      organization?.id as string
    );

    toast.promise(promise, {
      loading: t<string>('task:createTaskLoading'),
      success: () => {
        navigation(-1);
        return t<string>('task:createTaskSuccess');
      },
      error: t<string>('task:createTaskError'),
    });

    reset({
      title: '',
      description: '',
      dueDate: setDatetimeLocal(defaultDueDate),
      done: false,
      organizationId: '',
    });
  };

  useEffect(() => {
    reset({
      title: '',
      description: '',
      dueDate: setDatetimeLocal(defaultDueDate),
      done: false,
      organizationId: '',
    });
  }, [reset]);

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit((value) => {
        onSubmit(value.title, value.description, value.dueDate, value.done);
      })}
    >
      <TextField>
        <TextField.Label>
          <Trans i18nKey={'task:titleInputLabel'} />
          <TextField.Input
            required={titleControl.required}
            innerRef={titleControl.ref}
            name={titleControl.name}
            onBlur={titleControl.onBlur}
            onChange={titleControl.onChange}
            placeholder="Enter the task title"
          />
        </TextField.Label>
      </TextField>
      <TextField>
        <TextField.Label>
          <Trans i18nKey={'task:descriptionInputLabel'} />
          <TextField.Input
            required={descriptionControl.required}
            innerRef={descriptionControl.ref}
            name={descriptionControl.name}
            onBlur={descriptionControl.onBlur}
            onChange={descriptionControl.onChange}
            placeholder="Enter the task description"
          />
        </TextField.Label>
      </TextField>
      <TextField>
        <TextField.Label>
          <Trans i18nKey={'task:dueDateInputLabel'} />
          <TextField.Input
            type={'datetime-local'}
            required={dueDateControl.required}
            innerRef={dueDateControl.ref}
            name={dueDateControl.name}
            onBlur={dueDateControl.onBlur}
            onChange={dueDateControl.onChange}
          />
        </TextField.Label>
      </TextField>
      <Button className="w-full" loading={requestState.loading}>
        <Trans i18nKey={'task:createTaskButtonLabel'} />
      </Button>
    </form>
  );
};

export default CreateTaskForm;
