import { editGenreMutation } from '@/api/genre';
import type { GenrePublic } from '@/client';
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

import { Spinner } from '@/components/ui/spinner';

import { genreBaseSchema, type GenreSchema } from '@/schemas/genre.schema';

import { zodResolver } from '@hookform/resolvers/zod';
import { EditIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface EditGenreProps {
  genre: GenrePublic;
}

const EditGenre = ({ genre }: EditGenreProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<GenreSchema>({
    resolver: zodResolver(genreBaseSchema),
    mode: 'onSubmit',
    defaultValues: {
      genre: genre.genre,
    },
  });

  const mutation = editGenreMutation(genre.id, () => {
    setIsOpen(false);
  });

  const onSubmit = (data: GenreSchema) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onSelect={(e) => e.preventDefault()} onClick={() => setIsOpen(true)}>
        <Button variant="ghost" size="icon" className="bg-transparent text-gray-400">
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-138 overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className="mb-3">
            <DialogTitle>Edit the genre</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Fill out the form below to edit the genre to your library.
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

export default EditGenre;
