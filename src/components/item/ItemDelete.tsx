'use client';
import { TrashIcon } from 'lucide-react';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';

import { ItemDialog } from './ItemDialog';

interface Props {
  id: number;
  onDelete: (id: number) => Promise<any>;
}

export const ItemDelete = ({ id, onDelete }: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await onDelete(id);
        if (!result.success) {
          toast.add({ type: 'error', description: result.message });
          setOpen(false);
          return;
        }
        setOpen(false);
        toast.add({ type: 'success', description: result.message });
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
    });
  };

  return (
    <ItemDialog
      formID="form-delete"
      isPending={isPending}
      title="Delete"
      description="This item will be permanently deleted. Are you sure? You will not be able to undo this action."
      variant="destructive"
      actionTrigger={
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer rounded-full border bg-transparent text-gray-400"
            >
              <TrashIcon />
            </Button>
          }
        />
      }
    />
  );
};
