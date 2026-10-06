'use client';

import { Form, SubmitHandler, useForm } from '@formisch/react';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';

import { EntityType, schemas } from '@/schemas/registry';
import { Button } from '@/ui/button';
import { DialogTrigger } from '@/ui/dialog';
import { toast } from '@/ui/toast';

import { ItemDialog } from './item-dialog';

interface Props {
  id: number;
  label: string;

  entity: EntityType;
  action: string;
  onUpdate: (id: number, values: any) => any;
  initialData: Record<string, any>;

  children: (form: any) => React.ReactNode;
}

function ItemUpdate({ id, label, entity, action, onUpdate, initialData, children }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const activeSchema = (schemas[entity] as any)[action];
  const form = useForm({
    schema: activeSchema,
    initialInput: initialData,
  });

  const handleSubmit: SubmitHandler<typeof activeSchema> = async (values) => {
    setIsPending(true);
    try {
      const res = (await onUpdate(id, values)) as { success?: boolean; message?: string };

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
      formID={`form-update-${label.toLowerCase()}-${id}`}
      isOpen={open}
      onClose={setOpen}
      isPending={isPending}
      title={`Update ${label}`}
      description={`Fill out the form below to update the ${label.toLowerCase()}`}
      submitButtonLabel="Update"
      actionTrigger={
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer rounded-full border bg-transparent text-gray-400"
            >
              <PencilIcon />
            </Button>
          }
        />
      }
    >
      <Form of={form} id={`form-update-${label.toLowerCase()}-${id}`} onSubmit={handleSubmit}>
        {children(form)}
      </Form>
    </ItemDialog>
  );
}

export { ItemUpdate };
