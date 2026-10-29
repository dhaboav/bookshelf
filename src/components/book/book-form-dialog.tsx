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
import { getBookFormOptions } from './book-form-action';

const CURRENT_YEAR = new Date().getFullYear();

interface OptionItem {
  value: number;
  label: string;
}

interface BookFormProps {
  initialData?: BookFormInput;
  onSubmitAction: (values: BookFormOutput) => Promise<{ success?: boolean; message?: string }>;
}

export function BookFormDialog({ initialData, onSubmitAction }: BookFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [authorOptions, setAuthorOptions] = useState<OptionItem[]>([]);
  const [genreOptions, setGenreOptions] = useState<OptionItem[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [optionsLoaded, setOptionsLoaded] = useState(false);

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

  async function handleOpenChange(open: boolean) {
    setIsOpen(open);

    if (!open || optionsLoaded || isLoadingOptions) return;

    setIsLoadingOptions(true);

    try {
      const options = await getBookFormOptions();

      setAuthorOptions(options.authorOptions);
      setGenreOptions(options.genreOptions);
      setOptionsLoaded(true);
    } catch (error) {
      console.error(error);

      toast.add({
        type: 'error',
        description: 'Failed to load authors and genres.',
      });
    } finally {
      setIsLoadingOptions(false);
    }
  }

  const handleFormSubmit: SubmitHandler<typeof bookFormSchema> = async (values) => {
    try {
      const response = await onSubmitAction(values);

      toast.add({
        type: response.success ? 'success' : 'error',
        description: response.message || (response.success ? 'Success saving book.' : 'Failed saving book.'),
      });

      if (response.success) {
        setIsOpen(false);
        reset(form);
      }
    } catch (error) {
      console.error(error);

      toast.add({
        type: 'error',
        description: 'An unexpected system error occurred.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant={isEditing ? 'ghost' : 'default'} size={isEditing ? 'icon' : 'default'}>
            {isEditing ? <PencilIcon /> : <BookPlusIcon />}
            {!isEditing && <span className="hidden lg:flex">{formActionTitle} Book</span>}
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

        {isLoadingOptions ? (
          <div className="flex items-center justify-center gap-2 py-10">
            <Spinner />
            <span className="text-sm text-muted-foreground">Loading authors and genres...</span>
          </div>
        ) : (
          <Form id={formHtmlId} of={form} onSubmit={handleFormSubmit} className="my-4 space-y-2">
            <div className="grid gap-4 lg:grid-cols-4">
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
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0] ?? null;
                          field.onChange(file);
                        }}
                      />

                      {field.errors && (
                        <FieldError
                          errors={field.errors.map((message) => ({
                            message,
                          }))}
                        />
                      )}
                    </div>
                  </Field>
                )}
              </FormischField>

              <div className="grid gap-4 lg:col-span-3">
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
        )}

        <DialogFooter>
          <DialogClose
            render={
              <Button
                disabled={form.isSubmitting}
                variant="outline"
                onClick={() => reset(form)}
                className="text-foreground/60 hover:text-foreground cursor-pointer rounded-md border border-white/10 px-6 text-sm font-medium transition-colors hover:bg-white/5"
              >
                Cancel
              </Button>
            }
          />

          <Button
            type="submit"
            form={formHtmlId}
            disabled={form.isSubmitting || isLoadingOptions}
            className="cursor-pointer rounded-md border px-6 text-sm font-medium transition-colors"
          >
            {form.isSubmitting && <Spinner data-icon="inline-start" />}
            {formActionTitle} Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
