import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import Modal from '~/core/ui/Modal';
import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';

const CreateTaskModal: React.FCC<{}> = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigation = useNavigate();

  const onClose = (flag: boolean) => {
    navigation(-1);
    setIsOpen(flag);
  };

  return (
    <>
      <Modal heading={'Create Task'} isOpen={isOpen} setIsOpen={onClose}>
        <div className="flex ">
          <div className='flex-auto space-y-4'>
              <TextField.Label>
                Name
                <TextField.Input
                  placeholder='Name' />
                  
              </TextField.Label>

              <TextField.Label>
                Description
                <TextField.Input
                  placeholder='Description' />
              </TextField.Label>

             <Button className='w-full'>
                Create Task
             </Button>

          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
