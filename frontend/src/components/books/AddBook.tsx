import { authorsQueryOptions } from '@/api/author';
import { createBookMutation } from '@/api/book';
import { genresQueryOptions } from '@/api/genre';
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
import { bookBaseSchema, type BookCreateInput } from '@/schemas/book.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const AddBook = () => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<BookCreateInput>({
    resolver: zodResolver(bookBaseSchema),
    mode: 'onSubmit',
    defaultValues: {
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

  const mutation = createBookMutation(() => {
    form.reset();
    setIsOpen(false);
  });

  const onSubmit = (data: BookCreateInput) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-138 overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className="mb-3">
            <DialogTitle>Add a Book</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Fill out the form below to add a new book to your library.
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
                          <SelectLabel>Authors</SelectLabel>
                          {authors?.map((g: any) => (
                            <SelectItem key={g.id} value={g.id.toString()}>
                              {g.author}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              ></Controller>

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
                  </Field>
                )}
              ></Controller>

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
              <Button variant="outline" disabled={mutation.isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
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

export default AddBook;
