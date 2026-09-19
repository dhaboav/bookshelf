'use client';
import { addGenre } from '@/actions/genres';
import { ItemDialog } from '@/components/item/ItemDialog';
import { ItemDialogFooter } from '@/components/item/ItemDialogFooter';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { genreInsertSchema } from '@/db/schema/genres';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

type FormType = z.infer<typeof genreInsertSchema>;
const genreResolver = zodResolver(genreInsertSchema);

export const AddGenre = () => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormType>({
    resolver: genreResolver,
    defaultValues: { name: '' },
  });

  const onSubmit = (data: FormType) => {
    startTransition(async () => {
      try {
        const result = await addGenre(data.name);
        if (!result.success) {
          toast.add({ type: 'error', description: result.message });
          return;
        }
        form.reset();
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
    >
      <form id="genre-create-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="Genre name"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <ItemDialogFooter label="Add" isPending={isPending} formId="genre-create-form" />
      </form>
    </ItemDialog>
  );
};
