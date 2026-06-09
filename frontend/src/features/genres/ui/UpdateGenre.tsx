import type { GenrePublic } from '@/entities/genres';
import { genreSchema, useUpdateGenre, type GenreSchema } from '@/features/genres';

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
  Spinner,
} from '@/shared/ui';

import { zodResolver } from '@hookform/resolvers/zod';
import { EditIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface UpdateGenreProps {
  genre: GenrePublic;
  onSuccess: () => void;
}

export const UpdateGenre = ({ genre, onSuccess }: UpdateGenreProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateGenre, isPending } = useUpdateGenre();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GenreSchema>({
    resolver: zodResolver(genreSchema),
    mode: 'onSubmit',
    defaultValues: {
      genre: genre.genre,
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset({
        genre: genre.genre,
      });
    }
  };

  const onSubmit = (data: GenreSchema) => {
    updateGenre(
      { id: genre.id, data },
      {
        onSuccess: () => {
          handleOpenChange(false);
          onSuccess();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onSelect={(e) => e.preventDefault()} onClick={() => setIsOpen(true)}>
        <Button variant="ghost" size="icon" className="bg-transparent text-gray-400">
          <EditIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-138 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="mb-3">
            <DialogTitle>Edit the genre</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Fill out the form below to edit the genre to your library.
          </DialogDescription>

          <FieldGroup>
            <Field data-invalid={!!errors.genre}>
              <FieldLabel htmlFor="genre">
                Genre Name<span className="text-red-600">*</span>
              </FieldLabel>
              <Input
                {...register('genre')}
                id="genre"
                placeholder="Book genre"
                aria-invalid={!!errors.genre}
              />
              {errors.genre && <FieldError errors={[errors.genre]} />}
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
