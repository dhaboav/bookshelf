import type { AuthorPublic } from '@/entities/authors';
import { authorSchema, useUpdateAuthor, type AuthorSchema } from '@/features/authors';
import {
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  GenericInputFormDialog,
  Input,
} from '@/shared/ui';
import { EditIcon } from 'lucide-react';

import { useState } from 'react';

interface UpdateAuthorProps {
  author: AuthorPublic;
  onSuccess: () => void;
}

export const UpdateAuthor = ({ author, onSuccess }: UpdateAuthorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateAuthor, isPending } = useUpdateAuthor();

  const handleFormSubmit = (data: AuthorSchema) => {
    updateAuthor(
      { id: author.id, data },
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
      title="Update Author"
      labelName="Author Name"
      buttonLabel="Update"
      schema={authorSchema}
      isPending={isPending}
      defaultValues={{ author: author.author }}
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
