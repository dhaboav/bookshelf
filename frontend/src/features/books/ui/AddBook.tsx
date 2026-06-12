import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ScanLine } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { authorsQueryOptions } from '@/entities/authors';
import { genresQueryOptions } from '@/entities/genres';
import { BarcodeScanner } from '@/features/barcode-scanner';
import { bookSchema, useCreateBook, type BookCreateInput } from '@/features/books';

import { DialogCustom } from '@/entities/DialogCustom';
import {
  Button,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldError,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Textarea,
} from '@/shared/ui';

const LABEL_CLASS = 'text-foreground/40 text-[10px] uppercase tracking-[0.2em] block font-medium';
const FormLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <FieldLabel htmlFor={htmlFor} className={LABEL_CLASS}>
    {children}
  </FieldLabel>
);

export const AddBook = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createBook, isPending } = useCreateBook();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookCreateInput>({
    resolver: zodResolver(bookSchema),
    mode: 'onSubmit',
    defaultValues: {
      isbn: '',
      title: '',
      author_id: undefined,
      genre_id: undefined,
      total_pages: 0,
      published_year: 2026,
      description: '',
    },
  });

  const { data: genres } = useQuery(genresQueryOptions);
  const { data: authors } = useQuery(authorsQueryOptions);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) reset();
  };

  const onSubmit = (data: BookCreateInput) => {
    createBook(data, {
      onSuccess: () => handleOpenChange(false),
    });
  };

  return (
    <DialogCustom
      open={isOpen}
      onOpenChange={handleOpenChange}
      className="bg-sidebar flex h-auto max-h-[95vh] flex-col overflow-hidden p-0 lg:max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
        <DialogHeader className="border-border/10 shrink-0 border-b p-6">
          <DialogTitle>Catalogue Volume</DialogTitle>
          <DialogDescription>Enter metadata or scan the barcode to begin.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <div className="w-full space-y-4">
              <Field data-invalid={!!errors.isbn}>
                <FormLabel htmlFor="isbn">
                  ISBN / SCAN<span className="text-red-600">*</span>
                </FormLabel>
                <div className="flex w-full flex-row gap-x-2">
                  <Input
                    {...register('isbn')}
                    id="isbn"
                    placeholder="978-0..."
                    aria-invalid={!!errors.isbn}
                    className="w-[75%] lg:w-[80%]"
                  />
                  <div className="w-[25%] lg:w-[20%]">
                    <BarcodeScanner
                      disabled={isPending}
                      onScanSuccess={(scannedCode) => {
                        setValue('isbn', scannedCode, { shouldValidate: true });
                      }}
                      actionButton={
                        <Button
                          type="button"
                          variant="outline"
                          className="text-foreground/70 flex h-10 w-full cursor-pointer items-center justify-center gap-1 text-xs"
                        >
                          <ScanLine className="size-4" />
                          <span className="hidden sm:inline">Scan</span>
                        </Button>
                      }
                    />
                  </div>
                </div>
                {errors.isbn && <FieldError errors={[errors.isbn]} />}
              </Field>

              <Field data-invalid={!!errors.title}>
                <FormLabel htmlFor="title">
                  TITLE<span className="text-red-600">*</span>
                </FormLabel>
                <Input
                  {...register('title')}
                  id="title"
                  placeholder="Book title"
                  aria-invalid={!!errors.title}
                />
                {errors.title && <FieldError errors={[errors.title]} />}
              </Field>

              <Controller
                name="author_id"
                control={control}
                render={({ field }) => (
                  <Field data-invalid={!!errors.author_id}>
                    <FormLabel htmlFor="author_id">
                      AUTHOR<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      name="author_id"
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger id="author_id" name="author_id">
                        <SelectValue placeholder="Author name" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectGroup>
                          {authors?.map((a: any) => (
                            <SelectItem key={a.id} value={a.id.toString()}>
                              {a.author}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.author_id && <FieldError errors={[errors.author_id]} />}
                  </Field>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="genre_id"
                  control={control}
                  render={({ field }) => (
                    <Field data-invalid={!!errors.genre_id}>
                      <FormLabel htmlFor="genre_id">GENRE</FormLabel>
                      <Select
                        name="genre_id"
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={field.value?.toString()}
                      >
                        <SelectTrigger id="genre_id" name="genre_id">
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectGroup>
                            {genres?.map((g: any) => (
                              <SelectItem key={g.id} value={g.id.toString()}>
                                {g.genre}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.genre_id && <FieldError errors={[errors.genre_id]} />}
                    </Field>
                  )}
                />

                <Field data-invalid={!!errors.published_year}>
                  <FormLabel htmlFor="published_year">YEAR</FormLabel>
                  <Input
                    {...register('published_year', { valueAsNumber: true })}
                    id="published_year"
                    type="number"
                    placeholder="2026"
                    aria-invalid={!!errors.published_year}
                  />
                  {errors.published_year && <FieldError errors={[errors.published_year]} />}
                </Field>
              </div>
            </div>

            <div className="flex h-full w-full flex-col justify-between space-y-4">
              <Field data-invalid={!!errors.description} className="flex flex-1 flex-col">
                <FormLabel htmlFor="description">DESCRIPTION</FormLabel>
                <Textarea
                  {...register('description')}
                  id="description"
                  placeholder="A short summary..."
                  className="min-h-[120px] resize-none overflow-y-auto lg:h-[190px]"
                  aria-invalid={!!errors.description}
                />
                {errors.description && <FieldError errors={[errors.description]} />}
              </Field>

              <Field data-invalid={!!errors.total_pages}>
                <FormLabel htmlFor="total_pages">
                  TOTAL PAGES<span className="text-red-600">*</span>
                </FormLabel>
                <Input
                  {...register('total_pages', { valueAsNumber: true })}
                  id="total_pages"
                  type="number"
                  placeholder="0"
                  aria-invalid={!!errors.total_pages}
                />
                {errors.total_pages && <FieldError errors={[errors.total_pages]} />}
              </Field>
            </div>
          </div>
        </div>

        <DialogFooter className="border-border/10 bg-background/50 flex shrink-0 flex-row gap-3 border-t p-6">
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
            <span>{isPending ? 'Registering...' : 'Register Volume'}</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogCustom>
  );
};
