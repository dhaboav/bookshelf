import { genreSchema, useCreateGenre, type GenreSchema } from '@/features/genres';
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  GenericInputFormDialog,
  Input,
} from '@/shared/ui';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export const AddGenre = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createGenre, isPending } = useCreateGenre();

  const handleFormSubmit = (data: GenreSchema) => {
    createGenre(data, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <GenericInputFormDialog
      triggerButton={
        <Button
          size="icon"
          className="bg-gold/10 border-gold/20 text-gold hover:bg-gold/20 h-8 w-8 cursor-pointer rounded-full border"
        >
          <Plus className="size-4" />
        </Button>
      }
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Add a new genre"
      labelName="Genre Name"
      buttonLabel="Add"
      schema={genreSchema}
      isPending={isPending}
      defaultValues={{ genre: '' }}
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
