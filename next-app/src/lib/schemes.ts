import { integer, pgTable, snakeCase, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { defineRelations } from 'drizzle-orm';

export const timestamps = {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const authors = pgTable('author', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
});

export const genres = pgTable('genre', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
});

export const books = snakeCase.table('book', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  isbn: varchar({ length: 13 }).notNull().unique(),
  description: text(),
  coverImg: text(),
  totalPages: integer().notNull(),
  publishedYear: integer().notNull(),
  authorId: integer().references(() => authors.id),
  genreId: integer().references(() => genres.id),
  ...timestamps,
});

export const relations = defineRelations({ authors, genres, books }, (r) => ({
  books: {
    author: r.one.authors({
      from: r.books.authorId,
      to: r.authors.id,
    }),
    genre: r.one.genres({
      from: r.books.genreId,
      to: r.genres.id,
    }),
  },
  authors: { books: r.many.books() },
  genres: { books: r.many.books() },
}));
