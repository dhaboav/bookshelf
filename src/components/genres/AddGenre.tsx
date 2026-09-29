'use client';
import { Form, SubmitHandler, reset, useForm } from '@formisch/react';
import { PlusIcon } from 'lucide-react';
import { useState, useTransition } from 'react';

import { ItemDialog } from '@/components/item/ItemDialog';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { addGenre } from '@/db/crud/genres';
import { genreInsertSchema } from '@/db/schema/genres';

import { InputField } from '../ui/shared-form-fields';

export const AddGenre = () => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    schema: genreInsertSchema,
    initialInput: { name: '' },
  });

  const handleSubmit: SubmitHandler<typeof genreInsertSchema> = (values) => {
    startTransition(async () => {
      try {
        const result = await addGenre(values.name);
        if (!result.success) {
          toast.add({ type: 'error', description: result.message });
          return;
        }
        reset(form);
        setOpen(false);
        toast.add({ type: 'success', description: result.message });
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
    });
  };

  return (
    <ItemDialog
      label="Add Genre"
      open={open}
      setIsOpen={setOpen}
      triggerBtn={
        <DialogTrigger
          render={
            <Button
              size="icon"
              className="bg-gold/10 border-gold/20 text-gold hover:bg-gold/20 h-8 w-8 cursor-pointer rounded-full border"
            >
              <PlusIcon />
            </Button>
          }
        />
      }
      formID="form-genre-create"
      isPending={isPending}
      variant="destructive"
    >
      <Form of={form} id="form-genre-create" onSubmit={handleSubmit} className="space-y-4">
        <InputField of={form} path="name" label="name" placeholder="Author name" />
      </Form>
    </ItemDialog>
  );
};
