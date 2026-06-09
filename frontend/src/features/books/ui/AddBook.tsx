import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Scanner } from '@/components/layouts/Scanner';
import { authorsQueryOptions } from '@/features/authors/hooks/useAuthorQueries';
import { bookSchema, useCreateBook, type BookCreateInput } from '@/features/books';
import { genresQueryOptions } from '@/features/genres/hooks/useGenreQueries';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Spinner,
  Textarea,
} from '@/shared/ui';

export const AddBook = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createBook, isPending } = useCreateBook();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookCreateInput>({
    resolver: zodResolver(bookSchema),
    mode: 'onSubmit',
    defaultValues: {
      isbn: '',
      title: '',
      author_id: undefined,
      genre_id: undefined,
      total_pages: 0,
      published_year: 2026,
      description: '',
    },
  });

  const { data: genres } = useQuery(genresQueryOptions);
  const { data: authors } = useQuery(authorsQueryOptions);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) reset();
  };

  const onSubmit = (data: BookCreateInput) => {
    createBook(data, {
      onSuccess: () => {
        handleOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-138 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="mb-3">
            <DialogTitle>Add a Book</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Fill out the form below to add a new book to your library.
          </DialogDescription>

          <FieldGroup>
            <Scanner
              disabled={isPending}
              onScanSuccess={(scannedCode) => {
                setValue('isbn', scannedCode, { shouldValidate: true });
              }}
            />

            <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
              <Field data-invalid={!!errors.isbn}>
                <FieldLabel htmlFor="isbn">
                  ISBN<span className="text-red-600">*</span>
                </FieldLabel>
                <Input
                  {...register('isbn')}
                  id="isbn"
                  placeholder="Scan or enter book ISBN"
                  aria-invalid={!!errors.isbn}
                />
                {errors.isbn && <FieldError errors={[errors.isbn]} />}
              </Field>

              <Field data-invalid={!!errors.title}>
                <FieldLabel htmlFor="title">
                  Title<span className="text-red-600">*</span>
                </FieldLabel>
                <Input
                  {...register('title')}
                  id="title"
                  placeholder="Book title"
                  aria-invalid={!!errors.title}
                />
                {errors.title && <FieldError errors={[errors.title]} />}
              </Field>

              <Controller
                name="author_id"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.author_id}>
                    <FieldLabel htmlFor="author_id">
                      Author<span className="text-red-600">*</span>
                    </FieldLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select author" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          <SelectLabel>Authors</SelectLabel>
                          {authors?.map((a: any) => (
                            <SelectItem key={a.id} value={a.id.toString()}>
                              {a.author}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.author_id && <FieldError errors={[errors.author_id]} />}
                  </Field>
                )}
              />

              <Controller
                name="genre_id"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.genre_id}>
                    <FieldLabel htmlFor="genre_id">
                      Genre<span className="text-red-600">*</span>
                    </FieldLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
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
                    {errors.genre_id && <FieldError errors={[errors.genre_id]} />}
                  </Field>
                )}
              />

              <Field data-invalid={!!errors.total_pages}>
                <FieldLabel htmlFor="total_pages">
                  Total Pages<span className="text-red-600">*</span>
                </FieldLabel>
                <Input
                  {...register('total_pages', { valueAsNumber: true })}
                  id="total_pages"
                  type="number"
                  placeholder="e.g. 132"
                  aria-invalid={!!errors.total_pages}
                />
                {errors.total_pages && <FieldError errors={[errors.total_pages]} />}
              </Field>

              <Field data-invalid={!!errors.published_year}>
                <FieldLabel htmlFor="published_year">
                  Year Published<span className="text-red-600">*</span>
                </FieldLabel>
                <Input
                  {...register('published_year', { valueAsNumber: true })}
                  id="published_year"
                  type="number"
                  placeholder="e.g. 2026"
                  aria-invalid={!!errors.published_year}
                />
                {errors.published_year && <FieldError errors={[errors.published_year]} />}
              </Field>
            </div>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                {...register('description')}
                id="description"
                placeholder="A short summary..."
                rows={8}
                className="h-32 overflow-y-auto"
                aria-invalid={!!errors.description}
              />
              {errors.description && <FieldError errors={[errors.description]} />}
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4 justify-start">
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              <div className="flex items-center gap-x-1">
                {isPending && <Spinner data-icon="inline-start" />}
                <span>{isPending ? 'Saving...' : 'Save'}</span>
              </div>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
