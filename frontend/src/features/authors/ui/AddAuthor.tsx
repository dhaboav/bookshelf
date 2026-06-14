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
import { useCreateAuthor } from '../hooks/useAuthorQueries';
import { authorSchema, type AuthorSchema } from '../schemas/author.schema';

export const AddAuthor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createAuthor, isPending } = useCreateAuthor();

  const handleFormSubmit = (data: AuthorSchema) => {
    createAuthor(data, {
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
      title="Add a new author"
      labelName="Author Name"
      buttonLabel="Add"
      schema={authorSchema}
      isPending={isPending}
      defaultValues={{ author: '' }}
      onSubmit={handleFormSubmit}
      content={({ register, errors }) => (
        <FieldGroup>
          <Field data-invalid={!!errors.author}>
            <FieldLabel htmlFor="author">
              Author Name<span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              {...register('author')}
              id="author"
              placeholder="Book author"
              aria-invalid={!!errors.author}
            />
            {errors.author && <FieldError errors={[errors.author]} />}
          </Field>
        </FieldGroup>
      )}
    />
  );
};
