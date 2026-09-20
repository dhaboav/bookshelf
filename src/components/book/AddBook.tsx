'use client';
import { getAuthorsWithBookCount } from '@/actions/authors';
import { type BookInput, addBook } from '@/actions/books';
import { ItemDialog } from '@/components/item/ItemDialog';
import { ItemDialogFooter } from '@/components/item/ItemDialogFooter';
import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { bookInsertSchema } from '@/db/schema/books';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '../ui/combobox';
import { Textarea } from '../ui/textarea';

const bookResolver = zodResolver(bookInsertSchema);
const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'];

interface Test {
  value: number;
  label: string;
}

export const AddBook = () => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [allData, setAllData] = useState<Test[]>([]);

  // ✅ Correct: Fetch data after the client component mounts
  useEffect(() => {
    getAuthorsWithBookCount().then((data) => {
      // Explicitly transform the database shape to match your Test interface
      const formattedData: Test[] = data.map((item) => ({
        value: item.id, // Map database 'id' to 'key'
        label: item.name, // Map database 'name' to 'label'
      }));

      setAllData(formattedData);
    });
  }, []);

  console.log(allData);

  const form = useForm({
    resolver: bookResolver,
    defaultValues: {
      title: '',
      isbn: '',
      description: '',
      cover_img: '',
      total_pages: 0,
      published_year: new Date().getFullYear(),
      author_id: '',
      genre_id: '',
    },
  });

  const onSubmit = (data: BookInput) => {
    startTransition(async () => {
      try {
        const result = await addBook(data);
        if (!result.success) {
          toast.add({ type: 'error', description: result.message });
          setOpen(false);
          return;
        }
        form.reset();
        setOpen(false);
        toast.add({ type: 'success', description: result.message });
      } catch (error) {
        console.error('An unexpected error occurred:', error);
      }
    });
  };

  return (
    <ItemDialog
      label="Add Author"
      open={open}
      setIsOpen={setOpen}
      triggerBtn={
        <DialogTrigger
          render={
            <Button
              size="icon"
              className="bg-gold/10 border-gold/20 text-gold hover:bg-gold/20 h-8 w-8 cursor-pointer rounded-full border"
            >
              <PlusIcon />
            </Button>
          }
        />
      }
    >
      <form id="book-create-form" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Controller
              name="isbn"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>ISBN</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="971-390...."
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Book Title</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Book title"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="genre_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Genre</FieldLabel>
                  <Combobox
                    id={field.name}
                    value={field.value}
                    items={frameworks}
                    onValueChange={field.onChange}
                  >
                    <ComboboxInput placeholder="Selece a genre" />
                    <ComboboxContent>
                      <ComboboxEmpty>No genres found.</ComboboxEmpty>
                      <ComboboxList>
                        {(genre) => (
                          <ComboboxItem key={genre} value={genre}>
                            {genre}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="author_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Author</FieldLabel>
                  <Combobox
                    id={field.name}
                    value={field.value}
                    onValueChange={(val) => field.onChange(val ? Number(val) : null)}
                    items={allData}
                  >
                    <ComboboxInput placeholder="Selece a author" />
                    <ComboboxContent>
                      <ComboboxEmpty>No authors found.</ComboboxEmpty>
                      <ComboboxList>
                        {(data) => (
                          <ComboboxItem key={data.value} value={data.value}>
                            {data.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="published_year"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Year</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="total_pages"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Total Pages</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex flex-1 flex-col">
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="A short summary"
                  className="min-h-[120px] resize-none"
                  value={field.value ?? ''}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <ItemDialogFooter label="Add" isPending={isPending} formId="book-create-form" />
      </form>
    </ItemDialog>
  );
};
