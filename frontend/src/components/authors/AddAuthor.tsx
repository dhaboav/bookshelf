import { createAuthorMutation } from '@/api/author';
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
import { authorBaseSchema, type AuthorSchema } from '@/schemas/author.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const AddAuthor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<AuthorSchema>({
    resolver: zodResolver(authorBaseSchema),
    mode: 'onSubmit',
    defaultValues: {
      author: '',
    },
  });

  const mutation = createAuthorMutation(() => {
    form.reset();
    setIsOpen(false);
  });

  const onSubmit = (data: AuthorSchema) => {
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
            <DialogTitle>Add a Author</DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Fill out the form below to add a new author to your library.
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

export default AddAuthor;
