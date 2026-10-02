import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-orm/valibot';
import {
  length,
  maxLength,
  maxValue,
  minLength,
  minValue,
  omit,
  pipe,
  string,
  toNumber,
  unknown,
} from 'valibot';

import { authors } from './authors';
import { genres } from './genres';

// Helpers
const currentYear = new Date().getFullYear();
const timestamps = {
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const books = pgTable('book', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  isbn: varchar({ length: 13 }).notNull().unique(),
  description: text(),
  cover_img: text(),
  total_pages: integer().notNull(),
  published_year: integer().notNull(),
  author_id: integer()
    .references(() => authors.id)
    .notNull(),
  genre_id: integer()
    .references(() => genres.id)
    .notNull(),
  ...timestamps,
});

// Schemas
const baseSchema = {
  title: pipe(
    string(),
    minLength(4, 'Title must be at least 4 characters.'),
    maxLength(255, 'Title cannot exceed 255 characters.'),
  ),
  isbn: pipe(string(), length(13, 'ISBN must be exactly 13 characters long')),
  total_pages: pipe(
    unknown(),
    toNumber(),
    minValue(1, 'Must have at least 1 page.'),
    maxValue(10000, 'Page count cannot exceed 10,000.'),
  ),
  published_year: pipe(
    unknown(),
    toNumber(),
    minValue(2000, 'Year must be 2000 or later.'),
    maxValue(currentYear, "Year can't be more than present year."),
  ),
  author_id: pipe(unknown(), toNumber()),
  genre_id: pipe(unknown(), toNumber()),
};

export const bookInsertSchema = omit(createInsertSchema(books, baseSchema), ['created_at', 'updated_at']);
export const bookUpdateSchema = omit(createUpdateSchema(books, baseSchema), ['created_at', 'updated_at']);

// Types
export type Book = Omit<typeof books.$inferSelect, 'createdAt' | 'updatedAt'> & {
  genre: typeof genres.$inferSelect | null;
  author: typeof authors.$inferSelect | null;
};
