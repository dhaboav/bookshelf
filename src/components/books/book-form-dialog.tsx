'use client';

import { Form, SubmitHandler, reset, useForm } from '@formisch/react';
import { BookPlusIcon, PencilIcon } from 'lucide-react';
import { useState } from 'react';
import * as v from 'valibot';

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
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';

import { BookCover } from './book-cover';

// ==========================================
// 1. SCHEMAS & TYPES (Self-Documenting)
// ==========================================

const CURRENT_YEAR = new Date().getFullYear();

const BookFormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(4, 'Title must be at least 4 characters.'),
    v.maxLength(255, 'Title cannot exceed 255 characters.'),
  ),
  isbn: v.pipe(v.string(), v.length(13, 'ISBN must be exactly 13 characters long')),
  cover_img: v.nullable(v.optional(v.string(), '')),
  author_id: v.pipe(v.unknown(), v.toNumber()),
  genre_id: v.pipe(v.unknown(), v.toNumber()),
  total_pages: v.pipe(
    v.unknown(),
    v.toNumber(),
    v.minValue(1, 'Must have at least 1 page.'),
    v.maxValue(10000, 'Page count cannot exceed 10,000.'),
  ),
  published_year: v.pipe(
    v.unknown(),
    v.toNumber(),
    v.minValue(2000, 'Year must be 2000 or later.'),
    v.maxValue(CURRENT_YEAR, "Year can't be more than present year."),
  ),
  description: v.nullable(
    v.optional(
      v.union([
        v.literal(''),
        v.pipe(
          v.string(),

          v.minLength(20, 'Description must be at least 20 characters.'),
          v.maxLength(100, 'Description must be at most 100 characters.'),
        ),
      ]),
      '',
    ),
  ),
});

type BookFormInput = v.InferInput<typeof BookFormSchema>;
type BookFormOutput = v.InferOutput<typeof BookFormSchema>;

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
// COMPONENT
// ==========================================

export function BookFormDialog({ initialData, authorOptions, genreOptions, onSubmitAction }: BookFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isEditing = Boolean(initialData);
  const formActionTitle = isEditing ? 'Update' : 'Add';
  const formHtmlId = `${formActionTitle.toLowerCase()}-book-form`;

  const form = useForm({
    schema: BookFormSchema,
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

  const handleFormSubmit: SubmitHandler<typeof BookFormSchema> = async (values) => {
    try {
      const response = await onSubmitAction(values);

      toast.add({
        type: response.success ? 'success' : 'error',
        description: response.message || (response.success ? 'Success saving book.' : 'Failed saving book.'),
      });

      setIsOpen(false);
      reset(form);
    } catch {
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

        <Form id={formHtmlId} of={form} onSubmit={handleFormSubmit} className="space-y-4 my-4">
          <div className="grid lg:grid-cols-4 gap-4">
            {/* Cover Preview Section */}
            <div className="hidden flex-col items-center gap-2 lg:flex">
              <BookCover className="w-28" />
              <span className="text-xs text-muted-foreground">Preview</span>
            </div>

            {/* Fields Section */}
            <div className="col-span-3 grid gap-4">
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
