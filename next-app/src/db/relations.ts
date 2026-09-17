import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
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
