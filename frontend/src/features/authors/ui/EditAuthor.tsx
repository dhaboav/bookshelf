import type { AuthorPublic } from '@/client';
import { editAuthorMutation } from '@/features/authors/hooks/useAuthorQueries';
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

import { authorBaseSchema, type AuthorSchema } from '@/features/authors/schemas/author.schema';

import { zodResolver } from '@hookform/resolvers/zod';
import { EditIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface EditAuthorProps {
  author: AuthorPublic;
}

const EditAuthor = ({ author }: EditAuthorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<AuthorSchema>({
    resolver: zodResolver(authorBaseSchema),
    mode: 'onSubmit',
    defaultValues: {
      author: author.author,
    },
  });

  const mutation = editAuthorMutation(author.id, () => {
    setIsOpen(false);
  });

  const onSubmit = (data: AuthorSchema) => {
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
            <DialogTitle>Edit Author</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Fill out the form below to edit the author to your library.
          </DialogDescription>
          <FieldGroup>
            <Controller
              name="author"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Author Name<span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="text"
                    placeholder="Author name"
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

export default EditAuthor;
