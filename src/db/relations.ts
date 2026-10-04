import { defineRelations } from 'drizzle-orm';

import { authors } from '@/db/schemas/authors';
import { books } from '@/db/schemas/books';
import { genres } from '@/db/schemas/genres';

export const relations = defineRelations({ books, authors, genres }, (r) => ({
  books: {
    author: r.one.authors({
      from: r.books.author_id,
      to: r.authors.id,
    }),
    genre: r.one.genres({
      from: r.books.genre_id,
      to: r.genres.id,
    }),
  },
  authors: { books: r.many.books() },
  genres: { books: r.many.books() },
}));
