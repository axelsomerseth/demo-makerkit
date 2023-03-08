import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import setDatetimeLocal from './datetime';
import OrganizationContext from '~/lib/contexts/organization';
import toast from 'react-hot-toast';
import { useNavigate } from '@remix-run/react';

import type { Task } from '~/lib/tasks/types/task';

const defaultDueDate = new Date();
defaultDueDate.setDate(defaultDueDate.getDate() + 1);

const UpdateTaskForm: React.FCC<{ task: Task }> = ({ task }) => {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const { organization } = useContext(OrganizationContext);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: setDatetimeLocal(task.dueDate.toDate()),
      done: task.done,
      organizationId: task.organizationId,
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
    console.log(title, description, new Date(dueDate), done);
    // const promise = updateTask(
    //   title,
    //   description,
    //   new Date(dueDate),
    //   done,
    //   organization?.id as string
    // );

    // toast.promise(promise, {
    //   loading: t<string>('task:createTaskLoading'),
    //   success: () => {
    //     navigation(-1);
    //     return t<string>('task:createTaskSuccess');
    //   },
    //   error: t<string>('task:createTaskError'),
    // });

    reset({
      title: task.title,
      description: task.description,
      dueDate: setDatetimeLocal(task.dueDate.toDate()),
      done: task.done,
      organizationId: task.organizationId,
    });
  };

  // useEffect(() => {
  //   reset({
  //     title: task.title,
  //     description: task.description,
  //     dueDate: setDatetimeLocal(task.dueDate.toDate()),
  //     done: task.done,
  //     organizationId: task.organizationId,
  //   });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
      <Button className="w-full">
        <Trans i18nKey={'task:updateTaskButtonLabel'} />
      </Button>
    </form>
  );
};

export default UpdateTaskForm;
