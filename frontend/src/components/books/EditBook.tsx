import { authorsQueryOptions } from '@/api/author';
import { editBookMutation } from '@/api/book';
import { genresQueryOptions } from '@/api/genre';
import type { BookPublic } from '@/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

interface EditBookProps {
  book: BookPublic;
  onSuccess: () => void;
}

const currentYear = new Date().getFullYear();
const formSchema = z.object({
  title: z
    .string()
    .min(4, 'Title must be at least 4 characters.')
    .max(32, 'Title must be at most 32 characters.'),
  author_id: z.number(),
  genre_id: z.number(),
  total_pages: z.number(),
  published_year: z
    .number()
    .int('Year must be an integer')
    .min(1950, 'Year must be 1800 or later')
    .max(currentYear, 'Year cannot be in the future'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters.')
    .max(100, 'Description must be at most 100 characters.')
    .optional()
    .or(z.literal('')),
});

type formData = z.infer<typeof formSchema>;

const EditBook = ({ book, onSuccess }: EditBookProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: genres } = useQuery(genresQueryOptions);
  const { data: authors } = useQuery(authorsQueryOptions);

  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: book.title,
      author_id: book.author?.id,
      genre_id: book.genre?.id,
      total_pages: book.total_pages,
      published_year: book.published_year,
      description: book.description ?? undefined,
    },
  });

  const mutation = editBookMutation(book.id, () => {
    setIsOpen(false);
    onSuccess();
  });

  const onSubmit = (data: formData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => setIsOpen(true)}>
        <SquarePen /> Edit
      </DropdownMenuItem>
      <DialogContent className="max-h-138 overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className="mb-3">
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Fill out the form below to edit book entry to your library.
          </DialogDescription>
          <FieldGroup>
            <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Title<span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="text"
                      placeholder="Book title"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              ></Controller>

              <Controller
                name="author_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Author<span className="text-red-600">*</span>
                    </FieldLabel>

                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select author" />
                      </SelectTrigger>

                      <SelectContent position="popper">
                        <SelectGroup>
                          <SelectLabel>Genres</SelectLabel>
                          {authors?.map((g: any) => (
                            <SelectItem key={g.id} value={g.id.toString()}>
                              {g.author}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="genre_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Genre<span className="text-red-600">*</span>
                    </FieldLabel>

                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>

                      <SelectContent position="popper">
                        <SelectGroup>
                          <SelectLabel>Genres</SelectLabel>
                          {genres?.map((g: any) => (
                            <SelectItem key={g.id} value={g.id.toString()}>
                              {g.genre}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="total_pages"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Total Pages<span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      placeholder="e.g. 132"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              ></Controller>

              <Controller
                name="published_year"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Year Published<span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      placeholder="e.g. 2026"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              ></Controller>
            </div>

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="A short summary..."
                    rows={8}
                    className="h-32 overflow-y-auto"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            ></Controller>
          </FieldGroup>

          <DialogFooter className="mt-4 justify-start">
            <DialogClose asChild>
              <Button variant="ghost" type="button" disabled={mutation.isPending}>
                Cancel
              </Button>
            </DialogClose>

            <Button className="lg:w-24" type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <div className="flex flex-row items-center gap-x-1">
                  <Spinner data-icon="inline-start" />
                  <span>Save</span>
                </div>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBook;
