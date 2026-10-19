import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/valibot';
import * as v from 'valibot';

import { genre } from '@/db/schema';

// Schemas
const genreSelectSchema = createSelectSchema(genre);
export const genreInsertSchema = createInsertSchema(genre, {
  name: (schema) => v.pipe(schema, v.minLength(4, 'Name must be at least 4 characters.')),
});
export const genreUpdateSchema = createUpdateSchema(genre, {
  name: (schema) => v.pipe(schema, v.minLength(4, 'Name must be at least 4 characters.')),
});

export const genreWithTotalBooksSchema = v.object({
  ...genreSelectSchema.entries,
  totalBooks: v.number(),
});

// DB
export type GenreInsert = v.InferInput<typeof genreInsertSchema>;
export type GenreUpdate = v.InferInput<typeof genreUpdateSchema>;

// Types
export type Genre = typeof genre.$inferSelect;
export type GenreWithBook = v.InferOutput<typeof genreWithTotalBooksSchema>;
