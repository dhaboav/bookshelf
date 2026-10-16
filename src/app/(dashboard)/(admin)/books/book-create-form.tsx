'use client';

import { Author } from '@/db/schemas/authors';
import { Genre } from '@/db/schemas/genres';
import { ItemForm } from '@/shared/components/item/item-form';
import { ComboboxField, InputField, TextareaField } from '@/shared/components/shared-form-fields';

function BookCreateForm({
  actionType,
  genres,
  authors,
}: {
  actionType: any;
  genres: Genre[];
  authors: Author[];
}) {
  const years = new Date().getFullYear();

  const genresList = genres.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const authorsList = authors.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <ItemForm
      initialData={{
        isbn: '',
        title: '',
        description: '',
        cover_img: '',
        published_year: years,
        total_pages: 0,
        author_id: '',
        genre_id: '',
      }}
      entity="book"
      action="create"
      onSubmit={(values) => actionType(values)}
    >
      {(form) => (
        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <InputField of={form} path="isbn" label="isbn" placeholder="971-390...." />
            <InputField of={form} path="title" label="title" placeholder="Book Title" />

            <ComboboxField
              of={form}
              path="genre_id"
              label="genre"
              items={genresList}
              placeholder="Select a genre"
            />

            <ComboboxField
              of={form}
              path="author_id"
              label="author"
              items={authorsList}
              placeholder="Select an author"
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
      )}
    </ItemForm>
  );
}

export { BookCreateForm };
