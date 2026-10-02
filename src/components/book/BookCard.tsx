'use client';

import { CalendarIcon, CircleUserRoundIcon, ScrollTextIcon } from 'lucide-react';
import Image from 'next/image';

import { deleteBook, updateBook } from '@/db/crud/books';
import type { Book } from '@/db/schema/books';
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
    <div className="flex h-36 w-full flex-row items-center overflow-hidden">
      <div className="h-full w-24 shrink-0">
        <Image
          src={book.cover_img || '/next.svg'}
          width={1000}
          height={700}
          alt={book.title || 'Book cover'}
          className="h-full w-full rounded-sm object-cover"
        />
      </div>

      <div className="flex w-full flex-col justify-center overflow-hidden px-4 py-2">
        <div className="flex flex-row items-center justify-between">
          <p className="text-primary line-clamp-1 text-xs font-semibold">{book.genre?.name ?? 'UNKNOWN'}</p>
          <div className="flex items-center gap-1">
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
        </div>

        <h3 className="truncate text-lg font-bold">{book.title}</h3>
        <p className="line-clamp-2 text-sm font-light text-gray-700 dark:text-gray-300">{book.description}</p>
        <div className="mt-1.5 grid grid-cols-3 items-center">
          <div className="flex flex-row items-center gap-x-1">
            <CircleUserRoundIcon className="w-4" />
            <span className="text-tiny font-semibold">{book.author?.name ?? 'Unknown'}</span>
          </div>

          <div className="flex flex-row items-center gap-x-1">
            <CalendarIcon className="w-4" />
            <span className="text-tiny font-semibold">{book.published_year}</span>
          </div>

          <div className="flex flex-row items-center gap-x-1">
            <ScrollTextIcon className="w-4" />
            <span className="text-tiny font-semibold">{book.total_pages} Pages</span>
          </div>
        </div>
      </div>
    </div>
  );
}
