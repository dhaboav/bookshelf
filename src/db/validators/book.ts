import { createInsertSchema, createUpdateSchema } from 'drizzle-orm/valibot';
import * as v from 'valibot';

import { author, book, genre } from '@/db/schema';

const CURRENT_YEAR = new Date().getFullYear();

// Schemas
const ImageSchema = v.pipe(
  v.file('Please select an image file.'),
  v.mimeType(['image/jpeg', 'image/png', 'image/avif'], 'Must be JPEG, PNG, or AVIF.'),
  v.maxSize(2097152, 'Max image size is 2 MB.'),
);

export const bookFormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(4, 'Title must be at least 4 characters.'),
    v.maxLength(255, 'Title cannot exceed 255 characters.'),
  ),
  isbn: v.pipe(v.string(), v.length(13, 'ISBN must be exactly 13 characters long')),
  cover_img: v.nullable(v.optional(v.union([v.string(), ImageSchema]))),
  author_id: v.pipe(v.unknown(), v.toNumber()),
  genre_id: v.pipe(v.unknown(), v.toNumber()),
  total_pages: v.pipe(
    v.unknown(),
    v.toNumber(),
    v.minValue(1, 'Must have at least 1 page.'),
    v.maxValue(10000, 'Page count cannot exceed 10,000.'),
  ),
  published_year: v.pipe(
    v.unknown(),
    v.toNumber(),
    v.minValue(2000, 'Year must be 2000 or later.'),
    v.maxValue(CURRENT_YEAR, "Year can't be more than present year."),
  ),
  description: v.nullable(
    v.optional(
      v.union([
        v.literal(''),
        v.pipe(
          v.string(),

          v.minLength(20, 'Description must be at least 20 characters.'),
          v.maxLength(100, 'Description must be at most 100 characters.'),
        ),
      ]),
      '',
    ),
  ),
});

// DB
export const bookInsertSchema = createInsertSchema(book);
export const bookUpdateSchema = createUpdateSchema(book);

// Types
export type Book = Omit<typeof book.$inferSelect, 'author_id' | 'genre_id'> & {
  genre: typeof genre.$inferSelect | null;
  author: typeof author.$inferSelect | null;
};
export type BookFormInput = v.InferInput<typeof bookFormSchema>;
export type BookFormOutput = v.InferOutput<typeof bookFormSchema>;
