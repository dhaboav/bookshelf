'use client';

import { Form, SubmitHandler, useForm } from '@formisch/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { schemas } from '@/schemas/registry';
import { ComboboxField, InputField, TextareaField } from '@/shared/components/shared-form-fields';
import { Button } from '@/ui/button';
import { DialogTrigger } from '@/ui/dialog';
import { toast } from '@/ui/toast';

import { ItemDialog } from './item-dialog';

interface ItemProps {
  form: any;
  placeholder: string;
}

function ItemForm({ form, placeholder }: ItemProps) {
  return <InputField of={form} path="name" label="name" placeholder={placeholder} />;
}

interface T2 {
  id: number;
  name: string;
}

interface Test {
  value: number;
  label: string;
}

function BookForm({ form, dgenre, dauthor }: { form: any; dgenre: T2[]; dauthor: T2[] }) {
  const genres: Test[] = dgenre.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const authors: Test[] = dauthor.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InputField of={form} path="isbn" label="isbn" placeholder="971-390...." />
        <InputField of={form} path="title" label="title" placeholder="Book Title" />

        <ComboboxField
          of={form}
          path="genre_id"
          label="genre_id"
          items={genres}
          placeholder="Select a genre"
        />

        <ComboboxField
          of={form}
          path="author_id"
          label="author_id"
          items={authors}
          placeholder="Select a author"
        />

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
  );
}

interface Props {
  choice: 'author' | 'genre' | 'book';
  onCreateAction: (values: any) => Promise<{ success?: boolean; message?: string }>;
  genreData?: any;
  authorData?: any;
}
const thisYear = new Date().getFullYear();

function ItemAdd({ choice, onCreateAction, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const config = {
    author: {
      schema: schemas.author.create,
      initialInput: { name: '' },
      placeholder: 'Author Name',
      formComponent: (form: any) => <ItemForm form={form} placeholder="Author Name" />,
    },
    genre: {
      schema: schemas.genre.create,
      initialInput: { name: '' },
      placeholder: 'Genre Name',
      formComponent: (form: any) => <ItemForm form={form} placeholder="Genre Name" />,
    },
    book: {
      schema: schemas.book.create,
      initialInput: {
        title: '',
        isbn: '',
        description: '',
        cover_img: '',
        total_pages: 0,
        published_year: thisYear,
        author_id: '',
        genre_id: '',
      },
      formComponent: (form: any) => (
        <BookForm form={form} dauthor={props.authorData} dgenre={props.genreData} />
      ),
    },
  }[choice];

  const form = useForm({
    schema: config.schema,
    initialInput: config.initialInput,
  });

  const handleSubmit: SubmitHandler<typeof config.schema> = async (values) => {
    setIsPending(true);
    try {
      const res = await onCreateAction(values);

      if (!res.success) {
        toast.add({ type: 'warning', description: res.message });
      } else {
        toast.add({ type: 'success', description: res.message });
      }
      setOpen(false);
    } catch (error) {
      toast.add({
        type: 'error',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ItemDialog
      formID={`form-create-${choice}`}
      isOpen={open}
      onClose={setOpen}
      isPending={isPending}
      title={`Add ${choice}`}
      description={`Fill out the form below to create a new ${choice}`}
      submitButtonLabel="Add"
      actionTrigger={
        <DialogTrigger
          render={
            <Button
              size="icon"
              className="bg-green-600/10 border-green-600/20 text-green-600 hover:bg-green-600/20 h-8 w-8 cursor-pointer rounded-full border"
            >
              <PlusIcon />
            </Button>
          }
        />
      }
    >
      <Form of={form} id={`form-create-${choice}`} onSubmit={handleSubmit}>
        {config.formComponent(form)}
      </Form>
    </ItemDialog>
  );
}

export { ItemAdd };
