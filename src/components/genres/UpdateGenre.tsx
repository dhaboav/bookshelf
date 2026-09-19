'use client';
import { updateAuthor } from '@/actions/authors';
import { ItemDialog } from '@/components/item/ItemDialog';
import { ItemDialogFooter } from '@/components/item/ItemDialogFooter';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { genreUpdateSchema } from '@/db/schema/genres';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

type FormType = z.infer<typeof genreUpdateSchema>;
const genreResolver = zodResolver(genreUpdateSchema);

interface Props {
  id: number;
  initialName: string;
}

export const UpdateGenre = ({ id, initialName }: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormType>({
    resolver: genreResolver,
    defaultValues: { name: initialName },
  });

  const onSubmit = (data: FormType) => {
    startTransition(async () => {
      try {
        const result = await updateAuthor(id, data.name!);
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
    >
      <form
        id={`author-update-form-${id}`}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="Author name"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <ItemDialogFooter
          label="Update"
          isPending={isPending}
          formId={`author-update-form-${id}`}
        />
      </form>
    </ItemDialog>
  );
};
