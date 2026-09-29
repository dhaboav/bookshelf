'use client';
import { Form, SubmitHandler, reset, useForm } from '@formisch/react';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

import { ItemDialog } from '@/components/item/ItemDialog';
import { addBook } from '@/db/crud/books';
import { getGenresWithBookCount } from '@/db/crud/genres';
import { bookInsertSchema } from '@/db/schema/books';
import { Button } from '@/ui/button';
import { DialogTrigger } from '@/ui/dialog';
import { ComboboxField, InputField, TextareaField } from '@/ui/shared-form-fields';
import { toast } from '@/ui/toast';

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
    getGenresWithBookCount().then((data) => {
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
    schema: bookInsertSchema,
    initialInput: {
      title: '',
      isbn: '',
      description: '',
      cover_img: '',
      total_pages: 0,
      published_year: new Date().getFullYear(),
      author_id: 0,
      genre_id: 0,
    },
  });

  const handleSubmit: SubmitHandler<typeof bookInsertSchema> = (values) => {
    startTransition(async () => {
      try {
        const result = await addBook(values);
        if (!result.success) {
          toast.add({ type: 'error', description: result.message });
          setOpen(false);
          return;
        }
        reset(form);
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
      formID="form-create-book"
      isPending={isPending}
    >
      <Form of={form} id="form-create-book" onSubmit={handleSubmit}>
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <InputField of={form} path="isbn" label="isbn" placeholder="971-390...." />
            <InputField of={form} path="title" label="title" placeholder="Book Title" />

            <ComboboxField
              of={form}
              path="genre_id"
              label="genre_id"
              items={allData}
              placeholder="Select a genre"
            />

            {/* <ComboboxField
              of={form}
              path="author_id"
              label="author_id"
              items={allData}
              placeholder="Select a author"
            /> */}

            <InputField of={form} path="total_pages" label="total_pages" type="number" />
            <InputField of={form} path="published_year" label="year" type="number" />
          </div>
          <TextareaField
            of={form}
            path="description"
            label="description"
            placeholder="A short summary"
            className="min-h-30 resize-none"
          />
        </div>
      </Form>
    </ItemDialog>
  );
};
