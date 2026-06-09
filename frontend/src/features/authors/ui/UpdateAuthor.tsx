import type { AuthorPublic } from '@/entities/authors';
import { authorSchema, useUpdateAuthor, type AuthorSchema } from '@/features/authors';

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

interface UpdateAuthorProps {
  author: AuthorPublic;
  onSuccess: () => void;
}

export const UpdateAuthor = ({ author, onSuccess }: UpdateAuthorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateAuthor, isPending } = useUpdateAuthor();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthorSchema>({
    resolver: zodResolver(authorSchema),
    mode: 'onSubmit',
    defaultValues: {
      author: author.author,
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset({
        author: author.author,
      });
    }
  };

  const onSubmit = (data: AuthorSchema) => {
    updateAuthor(
      { id: author.id, data },
      {
        onSuccess: () => {
          handleOpenChange(false);
          onSuccess();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onSelect={(e) => e.preventDefault()} onClick={() => setIsOpen(true)}>
        <Button variant="ghost" size="icon" className="bg-transparent text-gray-400">
          <EditIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-138 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="mb-3">
            <DialogTitle>Edit Author</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Fill out the form below to edit the author to your library.
          </DialogDescription>

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
