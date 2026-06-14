import type { GenrePublic } from '@/entities/genres';
import { genreSchema, useUpdateGenre, type GenreSchema } from '@/features/genres';
import { GenericInputFormDialog } from '@/shared/ui';

import { Button, Field, FieldError, FieldGroup, FieldLabel, Input } from '@/shared/ui';

import { EditIcon } from 'lucide-react';
import { useState } from 'react';

interface UpdateGenreProps {
  genre: GenrePublic;
  onSuccess: () => void;
}

export const UpdateGenre = ({ genre, onSuccess }: UpdateGenreProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateGenre, isPending } = useUpdateGenre();

  const handleFormSubmit = (data: GenreSchema) => {
    updateGenre(
      { id: genre.id, data },
      {
        onSuccess: () => {
          setIsOpen(false);
          onSuccess();
        },
      },
    );
  };

  return (
    <GenericInputFormDialog
      triggerButton={
        <Button variant="ghost" size="icon" className="bg-transparent text-gray-400">
          <EditIcon />
        </Button>
      }
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Update genre"
      labelName="Genre Name"
      buttonLabel="Update"
      schema={genreSchema}
      isPending={isPending}
      defaultValues={{ genre: genre.genre }}
      onSubmit={handleFormSubmit}
      content={({ register, errors }) => (
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
      )}
    />
  );
};
