import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

const CreateTaskForm: React.FC<{}> = () => {
  const defaultDueDate = new Date();
  defaultDueDate.setHours(defaultDueDate.getHours() + 3);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      description: '',
      organizationId: '', // TODO: get from context
      dueDate: Timestamp.fromDate(defaultDueDate),
      isDone: false,
    },
  });

  const nameControl = register('name', { required: true });

  const onSubmit = (
    name: string,
    description: string,
    organizationId: string,
    dueDate: Timestamp,
    isDone: boolean
  ) => {
    console.log(name, description, organizationId, dueDate, isDone);
  };

  useEffect(() => {
    reset({
      name: '',
      description: '',
      organizationId: '',
      dueDate: Timestamp.now(),
      isDone: false,
    });
  }, [reset]);

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
          <TextField.Input placeholder="description" />
        </TextField.Label>
      </TextField>

      <TextField>
        <TextField.Label>
          Due date
          <TextField.Input type={'datetime-local'} />
        </TextField.Label>
      </TextField>

      <Button className="w-full">Create Task</Button>
    </form>
  );
};

export default CreateTaskForm;
