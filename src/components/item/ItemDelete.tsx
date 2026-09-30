'use client';

import { TrashIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/ui/button';
import { DialogTrigger } from '@/ui/dialog';
import { toast } from '@/ui/toast';

import { ItemDialog } from './ItemDialog';

interface Props {
  id: number;
  label: string;
  onDelete: (id: number) => any;
}

function ItemDelete({ id, label, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const res = (await onDelete(id)) as { success?: boolean; message?: string };

      if (!res.success) {
        toast.add({
          type: 'warning',
          description: res.message,
        });
      } else {
        toast.add({
          type: 'success',
          description: res.message,
        });
      }

      setOpen(false);
    } catch (error) {
      toast.add({
        type: 'error',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ItemDialog
      formID={`form-delete-${label}-${id}`}
      isOpen={open}
      onClose={setOpen}
      isPending={isPending}
      title="Delete"
      description="This item will be permanently deleted. Are you sure? You will not be able to undo this action."
      submitButtonLabel="Delete"
      variant="destructive"
      actionTrigger={
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer rounded-full border bg-transparent text-red-600"
            >
              <TrashIcon />
            </Button>
          }
        />
      }
    >
      <form id={`form-delete-${label}-${id}`} onSubmit={handleDelete} />
    </ItemDialog>
  );
}

export { ItemDelete };
