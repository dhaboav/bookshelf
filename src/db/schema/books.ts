import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createSchemaFactory } from 'drizzle-orm/zod';
import { z } from 'zod/v4';
import { authors } from './authors';
import { genres } from './genres';

// Helpers
const currentYear = new Date().getFullYear();
export const timestamps = {
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

const { createInsertSchema } = createSchemaFactory({
  coerce: {
    number: true,
  },
});

export const bookInsertSchema = createInsertSchema(books, {
  title: (schema) =>
    schema
      .min(4, 'Title must be at least 4 characters.')
      .max(255, 'Title cannot exceed 255 characters.'),
  isbn: (schema) => schema.length(13, 'ISBN must be exactly 13 characters long'),
  total_pages: z.coerce
    .number<number>()
    .min(1, 'Must have at least 1 page.')
    .max(10000, 'Page count cannot exceed 10,000.'),
  published_year: z.coerce
    .number<number>()
    .min(2000, 'Year must be 2000 or later.')
    .max(currentYear, 'Year cant more than present year.'),
  author_id: z.coerce.number(),
  genre_id: z.coerce.number(),
}).omit({
  created_at: true,
  updated_at: true,
});
