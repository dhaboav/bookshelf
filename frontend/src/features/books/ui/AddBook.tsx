// 📄 src/features/books/ui/AddBook.tsx
import { useQuery } from '@tanstack/react-query';
import { ImagePlus, Plus, ScanLine, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';

import { authorsQueryOptions } from '@/entities/authors';
import { genresQueryOptions } from '@/entities/genres';
import { BarcodeScanner } from '@/features/barcode-scanner';
import { bookSchema, useCreateBook, type BookCreateInput } from '@/features/books';
import { GenericInputFormDialog } from '@/shared/ui';

import {
  Button,
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
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutate: createBook, isPending } = useCreateBook();

  const { data: genres } = useQuery(genresQueryOptions);
  const { data: authors } = useQuery(authorsQueryOptions);

  const handleFormSubmit = (data: BookCreateInput) => {
    createBook(data, {
      onSuccess: () => setIsOpen(false),
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
      title="Catalogue Volume"
      labelName="book metadata"
      buttonLabel="Register Volume"
      schema={bookSchema}
      isPending={isPending}
      defaultValues={{
        isbn: '',
        title: '',
        cover: '',
        author_id: undefined,
        genre_id: undefined,
        total_pages: 0,
        published_year: 2026,
        description: '',
      }}
      onSubmit={handleFormSubmit}
      content={({ register, errors, control, setValue }) => (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <Controller
            name="cover"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.cover} className="w-full">
                <FormLabel htmlFor="cover_input">Cover</FormLabel>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => fileRef.current?.click()}
                  className="bg-background/30 group relative flex aspect-[4/5] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/10 transition-all hover:ring-white/20"
                >
                  {field.value ? (
                    <>
                      <img
                        src={field.value}
                        alt="Cover preview"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <Upload className="size-4" />
                        <span className="font-mono text-[9px] tracking-widest uppercase">
                          Replace
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-foreground/40 group-hover:text-foreground/70 flex flex-col items-center gap-2 transition-colors">
                      <ImagePlus className="size-6" />
                      <span className="font-mono text-[9px] tracking-widest uppercase">Upload</span>
                    </div>
                  )}
                </button>

                <input
                  id="cover_input"
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const reader = new FileReader();
                      reader.onloadend = () => field.onChange(reader.result as string);
                      reader.readAsDataURL(files[0]);
                    }
                  }}
                  className="hidden"
                />

                {field.value && (
                  <button
                    type="button"
                    onClick={() => field.onChange('')}
                    className="text-foreground/40 mt-2 w-full text-center font-mono text-[9px] tracking-widest uppercase transition-colors hover:text-red-500"
                  >
                    Remove cover
                  </button>
                )}
                {errors.cover && <FieldError errors={[errors.cover]} />}
              </Field>
            )}
          />

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
                        className="text-foreground/70 flex h-10 w-full items-center justify-center gap-1 text-xs"
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
                      value={field.value?.toString() ?? ''}
                    >
                      <SelectTrigger id="genre_id">
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
                      value={field.value?.toString() ?? ''}
                    >
                      <SelectTrigger id="author_id">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.published_year}>
                <FormLabel htmlFor="published_year">YEAR</FormLabel>
                <Input
                  {...register('published_year', { valueAsNumber: true })}
                  id="published_year"
                  type="number"
                  aria-invalid={!!errors.published_year}
                />
                {errors.published_year && <FieldError errors={[errors.published_year]} />}
              </Field>

              <Field data-invalid={!!errors.total_pages}>
                <FormLabel htmlFor="total_pages">
                  TOTAL PAGES<span className="text-red-600">*</span>
                </FormLabel>
                <Input
                  {...register('total_pages', { valueAsNumber: true })}
                  id="total_pages"
                  type="number"
                  aria-invalid={!!errors.total_pages}
                />
                {errors.total_pages && <FieldError errors={[errors.total_pages]} />}
              </Field>
            </div>

            <Field data-invalid={!!errors.description} className="flex flex-1 flex-col">
              <FormLabel htmlFor="description">DESCRIPTION</FormLabel>
              <Textarea
                {...register('description')}
                id="description"
                placeholder="A short summary..."
                className="min-h-[120px] resize-none"
                aria-invalid={!!errors.description}
              />
              {errors.description && <FieldError errors={[errors.description]} />}
            </Field>
          </div>
        </div>
      )}
    />
  );
};
