'use client';
import { addAuthor } from '@/actions/authors';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { authorInsertSchema } from '@/db/schema/authors';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

export default function AuthorForm() {
  type formType = z.infer<typeof authorInsertSchema>;
  const form = useForm<formType>({
    resolver: zodResolver(authorInsertSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(data: formType) {
    startTransition(async () => {
      try {
        // Send data to your server action
        const result = await addAuthor(data.name);

        if (!result.success) {
          toast.add({
            type: 'error',
            description: result.message,
          });

          return;
        }

        // Reset form on success
        form.reset();
        toast.add({
          type: 'success',
          description: result.message,
        });
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
    });
  }

  return (
    <div>
      <form id="test-form" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Testing author name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>
      <Button type="submit" form="test-form">
        Submit
      </Button>
    </div>
  );
}
