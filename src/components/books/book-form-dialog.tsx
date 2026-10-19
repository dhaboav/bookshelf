'use client';

import { Form, Field as FormischField, SubmitHandler, reset, useForm } from '@formisch/react';
import { BookPlusIcon, PencilIcon } from 'lucide-react';
import { useState } from 'react';

import { ComboboxField, InputField, TextareaField } from '@/components/shared-form-fields';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { BookFormInput, BookFormOutput, bookFormSchema } from '@/db/validators/book';

import { BookCover } from './book-cover';

// ==========================================
// SCHEMAS & TYPES
const CURRENT_YEAR = new Date().getFullYear();

interface OptionItem {
  value: any;
  label: string;
}

interface BookFormProps {
  initialData?: BookFormInput;
  authorOptions: OptionItem[];
  genreOptions: OptionItem[];
  onSubmitAction: (values: BookFormOutput) => Promise<{ success?: boolean; message?: string }>;
}
// ==========================================

export function BookFormDialog({ initialData, authorOptions, genreOptions, onSubmitAction }: BookFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isEditing = Boolean(initialData);
  const formActionTitle = isEditing ? 'Update' : 'Add';
  const formHtmlId = `${formActionTitle.toLowerCase()}-book-form`;

  const form = useForm({
    schema: bookFormSchema,
    initialInput: {
      title: initialData?.title ?? '',
      isbn: initialData?.isbn ?? '',
      cover_img: initialData?.cover_img ?? '',
      author_id: initialData?.author_id ?? '',
      genre_id: initialData?.genre_id ?? '',
      total_pages: initialData?.total_pages ?? '',
      published_year: initialData?.published_year ?? CURRENT_YEAR,
      description: initialData?.description ?? '',
    },
  });

  const handleFormSubmit: SubmitHandler<typeof bookFormSchema> = async (values) => {
    try {
      const response = await onSubmitAction(values);

      toast.add({
        type: response.success ? 'success' : 'error',
        description: response.message || (response.success ? 'Success saving book.' : 'Failed saving book.'),
      });

      setIsOpen(false);
      reset(form);
    } catch (error) {
      console.error(error);
      toast.add({
        type: 'error',
        description: 'An unexpected system error occurred.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button variant={isEditing ? 'ghost' : 'default'} size={isEditing ? 'icon' : 'default'}>
            {isEditing ? <PencilIcon /> : <BookPlusIcon />}
            {!isEditing && <span>{formActionTitle} Book</span>}
          </Button>
        }
      />

      <DialogContent className="max-h-[85vh] overflow-y-auto lg:max-h-[95vh] lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>{formActionTitle} Book</DialogTitle>
          <DialogDescription>
            Provide the necessary details for this book. Make sure all required fields are filled out.
          </DialogDescription>
        </DialogHeader>

        <Form id={formHtmlId} of={form} onSubmit={handleFormSubmit} className="space-y-2 my-4">
          <div className="grid lg:grid-cols-4 gap-4">
            <FormischField of={form} path={['cover_img']}>
              {(field) => (
                <Field data-invalid={field.errors !== null}>
                  <BookCover image={field.input} />
                  <div className="space-y-2">
                    <FieldLabel htmlFor="cover_img">Book Cover</FieldLabel>
                    <Input
                      id="cover_img"
                      type="file"
                      accept="image/*"
                      aria-invalid={field.errors !== null}
                      onChange={(e) => {
                        const file = e.currentTarget.files?.[0] ?? null;
                        field.onChange(file);
                      }}
                    />
                    {field.errors && <FieldError errors={field.errors.map((message) => ({ message }))} />}
                  </div>
                </Field>
              )}
            </FormischField>

            <div className="lg:col-span-3 grid gap-4">
              <InputField of={form} path="title" label="Title" placeholder="Book Title" />

              <div className="grid gap-4 lg:grid-cols-2">
                <ComboboxField
                  of={form}
                  path="author_id"
                  label="Author"
                  items={authorOptions}
                  placeholder="Select an author"
                />
                <ComboboxField
                  of={form}
                  path="genre_id"
                  label="Genre"
                  items={genreOptions}
                  placeholder="Select a genre"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <InputField of={form} path="isbn" label="ISBN" placeholder="978..." />
                <InputField of={form} path="published_year" label="Published" type="number" />
                <InputField of={form} path="total_pages" label="Pages" placeholder="365" type="number" />
              </div>

              <TextareaField
                of={form}
                path="description"
                label="Description"
                placeholder="What's it about?"
                className="min-h-30 resize-none"
              />
            </div>
          </div>
        </Form>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                disabled={form.isSubmitting}
                variant="outline"
                onClick={() => reset(form)}
                className="text-foreground/60 hover:text-foreground h-11 cursor-pointer rounded-xl border border-white/10 px-6 text-sm font-medium transition-colors hover:bg-white/5"
              >
                Cancel
              </Button>
            }
          />

          <Button
            type="submit"
            form={formHtmlId}
            disabled={form.isSubmitting}
            className="h-11 cursor-pointer rounded-xl border px-6 text-sm font-medium transition-colors"
          >
            {form.isSubmitting && <Spinner data-icon="inline-start" />}
            {formActionTitle} Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
