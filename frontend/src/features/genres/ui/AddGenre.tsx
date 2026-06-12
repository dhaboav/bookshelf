import { DialogCustom } from '@/entities/DialogCustom';
import { genreSchema, useCreateGenre, type GenreSchema } from '@/features/genres';
import {
  Button,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Spinner,
} from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const AddGenre = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createGenre, isPending } = useCreateGenre();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GenreSchema>({
    resolver: zodResolver(genreSchema),
    mode: 'onSubmit',
    defaultValues: {
      genre: '',
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) reset();
  };

  const onSubmit = (data: GenreSchema) => {
    createGenre(data, {
      onSuccess: () => {
        handleOpenChange(false);
      },
    });
  };

  return (
    <DialogCustom open={isOpen} onOpenChange={setIsOpen} className="max-h-138 overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader className="mb-3">
          <DialogTitle>Add a new Genre</DialogTitle>
        </DialogHeader>

        <DialogDescription className="sr-only">
          Fill out the form below to add a new genre to your library.
        </DialogDescription>

        <FieldGroup>
          <Field data-invalid={!!errors.genre}>
            <FieldLabel htmlFor="genre">
              Genre Name<span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              {...register('genre')}
              id="genre"
              placeholder="Genre Name"
              aria-invalid={!!errors.genre}
            />
            {errors.genre && <FieldError errors={[errors.genre]} />}
          </Field>
        </FieldGroup>

        <DialogFooter className="border-border/10 bg-background/50 flex shrink-0 flex-row gap-3 border-t py-6">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              className="text-foreground/60 hover:text-foreground h-11 cursor-pointer rounded-xl border border-white/10 px-6 text-sm font-medium transition-colors hover:bg-white/5"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="submit"
            disabled={isPending}
            className="bg-gold/10 border-gold/20 text-gold hover:bg-gold/20 flex h-11 flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-xl border text-sm font-medium tracking-wide transition-all"
          >
            {isPending && <Spinner data-icon="inline-start" />}
            <span>{isPending ? 'Saving...' : 'Save'}</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogCustom>
  );
};
