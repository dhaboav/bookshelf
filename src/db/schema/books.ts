import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-orm/zod';
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
  author_id: integer().references(() => authors.id),
  genre_id: integer().references(() => genres.id),
  ...timestamps,
});

// Schemas
export const bookInsertSchema = createInsertSchema(books, {
  title: (schema) =>
    schema
      .min(4, 'Title must be at least 4 characters.')
      .max(255, 'Title must be at most 255 characters.'),
  isbn: (schema) => schema.length(13, 'ISBN must be exactly 13 characters long'),
  published_year: (schema) =>
    schema
      .int('Year must be an integer.')
      .min(2000, 'Year must be 2000 or later.')
      .max(currentYear, 'Year cant more than present year.'),
}).omit({
  created_at: true,
  updated_at: true,
});
