'use client';

import { BookInput, addBook } from '@/actions/books';
import { ItemDialog } from '@/components/item/ItemDialog';
import { ItemDialogFooter } from '@/components/item/ItemDialogFooter';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { bookInsertSchema } from '@/db/schema/books';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Textarea } from '../ui/textarea';

const bookResolver = zodResolver(bookInsertSchema);

export const AddBook = () => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<BookInput>({
    resolver: bookResolver,
    defaultValues: {
      title: '',
      isbn: '',
      description: '',
      cover_img: '',
      total_pages: 0,
      published_year: new Date().getFullYear(),
      author_id: undefined,
      genre_id: undefined,
    },
  });

  const onSubmit = (data: BookInput) => {
    startTransition(async () => {
      try {
        const result = await addBook(data);
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
      label="Add Author"
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
      <form
        id="book-create-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2"
      >
        <div className="w-full space-y-4">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="title">title</FieldLabel>
                <Input
                  {...field}
                  id="title"
                  placeholder="Book title"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="published_year"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="published_year">Year</FieldLabel>
                  <Input
                    {...field}
                    id="published_year"
                    type="number"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="total_pages"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="total_pages">Total Pages</FieldLabel>
                  <Input
                    {...field}
                    id="total_pages"
                    type="number"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  aria-invalid={fieldState.invalid}
                  placeholder="A short summary"
                  className="min-h-[120px] resize-none"
                  value={field.value ?? ''}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <ItemDialogFooter label="Add" isPending={isPending} formId="book-create-form" />
      </form>
    </ItemDialog>
  );
};
