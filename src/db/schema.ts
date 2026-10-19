import { defineRelations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// Helper func
const timestamps = {
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

// Table Definition
export const book = pgTable('book', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  isbn: varchar({ length: 13 }).notNull().unique(),
  description: text(),
  cover_img: text(),
  total_pages: integer().notNull(),
  published_year: integer().notNull(),
  author_id: integer()
    .references(() => author.id)
    .notNull(),
  genre_id: integer()
    .references(() => genre.id)
    .notNull(),
  ...timestamps,
});

export const author = pgTable('author', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
});

export const genre = pgTable('genre', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
});

// Relationship
export const relations = defineRelations({ book, author, genre }, (r) => ({
  book: {
    author: r.one.author({
      from: r.book.author_id,
      to: r.author.id,
    }),
    genre: r.one.genre({
      from: r.book.genre_id,
      to: r.genre.id,
    }),
  },
  authors: { books: r.many.book() },
  genres: { books: r.many.book() },
}));
