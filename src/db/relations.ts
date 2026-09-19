import { defineRelations } from 'drizzle-orm';
import { authors } from './schema/authors';
import { books } from './schema/books';
import { genres } from './schema/genres';

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
