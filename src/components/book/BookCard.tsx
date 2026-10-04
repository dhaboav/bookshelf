'use client';

import { CalendarIcon, CircleUserRoundIcon, ScrollTextIcon } from 'lucide-react';
import Image from 'next/image';

import { deleteBook, updateBook } from '@/db/crud/books';
import type { Book } from '@/db/schema/books';
import { Badge } from '@/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { ComboboxField, InputField, TextareaField } from '@/ui/shared-form-fields';

import { ItemDelete } from '../item/ItemDelete';
import { ItemUpdate } from '../item/ItemUpdate';

interface MasterItem {
  id: number;
  name: string;
}

interface Props {
  book: Book;
  genres: MasterItem[];
  authors: MasterItem[];
}

export function BookCard({ book, genres, authors }: Props) {
  const genresList = genres.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const authorsList = authors.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <Card className="grid group relative overflow-hidden border transition-colors duration-200 hover:border-foreground/30">
      <Image
        src={book.cover_img || '/cover.jpg'}
        width={1000}
        height={700}
        alt={book.title || 'Book cover'}
        className="col-start-1 row-start-1 h-full w-full object-cover"
      />

      <Badge
        variant="secondary"
        className="uppercase text-tiny col-start-1 row-start-1 z-10 m-3 justify-self-start self-start"
      >
        {book.genre?.name ?? 'UNKNOWN'}
      </Badge>

      <div className="col-start-1 row-start-1 z-20 m-3 flex items-center justify-self-end self-start lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/80 backdrop-blur-sm rounded-md">
        <ItemUpdate
          id={book.id}
          label={book.title}
          entity="book"
          action="update"
          initialData={{
            isbn: book.isbn,
            title: book.title,
            description: book.description,
            cover_img: book.cover_img,
            published_year: book.published_year,
            total_pages: book.total_pages,
            author_id: book.author_id,
            genre_id: book.genre_id,
          }}
          onUpdate={updateBook}
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
        </ItemUpdate>
        <ItemDelete id={book.id} label={book.title} onDelete={deleteBook} />
      </div>

      {/* Card Header */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{book.title}</CardTitle>
        <span>{book.author?.name}</span>
      </CardHeader>
    </Card>
  );
}
