'use client';
import { Form, SubmitHandler, useForm } from '@formisch/react';
import { EditIcon } from 'lucide-react';
import { useState, useTransition } from 'react';

import { ItemDialog } from '@/components/item/ItemDialog';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { updateGenre } from '@/db/crud/genres';
import { genreUpdateSchema } from '@/db/schema/genres';

import { InputField } from '../ui/shared-form-fields';

interface Props {
  id: number;
  initialName: string;
}

export const UpdateGenre = ({ id, initialName }: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    schema: genreUpdateSchema,
    initialInput: { name: initialName },
  });

  const handleSubmit: SubmitHandler<typeof genreUpdateSchema> = (values) => {
    startTransition(async () => {
      try {
        const result = await updateGenre(id, values.name!);
        if (!result.success) {
          toast.add({ type: 'error', description: result.message });
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
      label="Update Genre"
      open={open}
      setIsOpen={setOpen}
      triggerBtn={
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer rounded-full border bg-transparent text-gray-400"
            >
              <EditIcon />
            </Button>
          }
        />
      }
      formID="form-update-genre"
      isPending={isPending}
    >
      <Form of={form} id="form-update-genre" onSubmit={handleSubmit} className="space-y-4">
        <InputField of={form} path="name" label="name" placeholder="Author name" />
      </Form>
    </ItemDialog>
  );
};
