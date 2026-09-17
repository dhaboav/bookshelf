import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const timestamps = {
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp({ withTimezone: true })
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

export const books = pgTable('book', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  isbn: varchar({ length: 13 }).notNull().unique(),
  description: text(),
  cover_img: text(),
  total_pages: integer().notNull(),
  published_year: integer().notNull(),
  author_id: integer().references(() => authors.id),
  genre_id: integer().references(() => genres.id),
  ...timestamps,
});
