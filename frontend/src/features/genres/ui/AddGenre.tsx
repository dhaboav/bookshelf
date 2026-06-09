import { createGenreMutation } from '@/features/genres/hooks/useGenreQueries';
import { genreBaseSchema, type GenreSchema } from '@/features/genres/schemas/types';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Spinner } from '@/shared/ui/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const AddGenre = () => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<GenreSchema>({
    resolver: zodResolver(genreBaseSchema),
    mode: 'onSubmit',
    defaultValues: {
      genre: '',
    },
  });

  const mutation = createGenreMutation(() => {
    form.reset();
    setIsOpen(false);
  });

  const onSubmit = (data: GenreSchema) => {
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
            <DialogTitle>Add a new Genre</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Fill out the form below to add a new genre to your library.
          </DialogDescription>
          <FieldGroup>
            <Controller
              name="genre"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Genre<span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="text"
                    placeholder="Genre"
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

export default AddGenre;
