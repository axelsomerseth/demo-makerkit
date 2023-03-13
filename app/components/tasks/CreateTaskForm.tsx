import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';

const CreateTaskForm: React.FC<{}> = () => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { title: '', description: '', dueDate: new Date() },
  });

  const titleControl = register('title', { required: true });
  const descriptionControl = register('description', { required: true });
  const dueDateControl = register('dueDate', { required: true });

  const onSubmit = (title: string, description: string, dueDate: Date) => {
    console.log(title, description, dueDate);
  };

  useEffect(() => {
    reset({ title: '', description: '', dueDate: new Date() });
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit((values) => {
          return onSubmit(values.title, values.description, values.dueDate);
        })}
      >
        <TextField>
          <TextField.Label>
            <Trans i18nKey={'task:titleInputLabel'} />
            <TextField.Input
              type="text"
              name={titleControl.name}
              required={titleControl.required}
              innerRef={titleControl.ref}
              onChange={titleControl.onChange}
              onBlur={titleControl.onBlur}
              placeholder="Enter the task title"
              data-cy="title-input"
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'task:descriptionInputLabel'} />
            <TextField.Input
              type="text"
              name={descriptionControl.name}
              required={descriptionControl.required}
              innerRef={descriptionControl.ref}
              onChange={descriptionControl.onChange}
              onBlur={descriptionControl.onBlur}
              placeholder="Enter a detailed description"
              data-cy="description-input"
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            <Trans i18nKey={'task:dueDateInputLabel'} />
            <TextField.Input
              type="datetime-local"
              name={dueDateControl.name}
              required={dueDateControl.required}
              innerRef={dueDateControl.ref}
              onChange={dueDateControl.onChange}
              onBlur={dueDateControl.onBlur}
              data-cy="dueDate-input"
            />
          </TextField.Label>
        </TextField>

        <Button className="w-full">
          <Trans i18nKey={'task:createTaskSubmitLabel'} />
        </Button>
      </form>
    </>
  );
};

export default CreateTaskForm;
