'use client';

import { ItemForm } from '@/components/item/item-form';
import { ComboboxField, InputField, TextareaField } from '@/components/shared-form-fields';
import { Author } from '@/db/schemas/authors';
import { Genre } from '@/db/schemas/genres';

import { BookCover } from './book-cover';

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
        total_pages: '',
        author_id: '',
        genre_id: '',
      }}
      entity="book"
      action="create"
      onSubmit={(values) => actionType(values)}
    >
      {(form) => (
        <div className="grid lg:grid-cols-4">
          <div className="hidden flex-col items-center gap-2 lg:flex">
            <BookCover className="w-28" />
            <span className="text-xs text-muted-foreground">Preview</span>
          </div>
          <div className="col-span-3 gap-4 grid">
            <InputField of={form} path="title" label="Title" placeholder="Book Title" />
            <div className="grid gap-4 lg:grid-cols-2">
              <ComboboxField
                of={form}
                path="author_id"
                label="Author"
                items={authorsList}
                placeholder="Select an author"
              />
              <ComboboxField
                of={form}
                path="genre_id"
                label="Genre"
                items={genresList}
                placeholder="Select a genre"
              />
            </div>
            <div className="grid  gap-4 lg:grid-cols-3">
              <InputField of={form} path="isbn" label="ISBN" placeholder="978..." />
              <InputField of={form} path="published_year" label="Published" type="number" />
              <InputField of={form} path="total_pages" label="Pages" placeholder="365" type="number" />
            </div>
            <TextareaField
              of={form}
              path="description"
              label="Description"
              placeholder="What's it about?"
              className="min-h-30 resize-none"
            />
          </div>
        </div>
      )}
    </ItemForm>
  );
}

export { BookCreateForm };
