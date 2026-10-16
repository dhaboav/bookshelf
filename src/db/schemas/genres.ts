import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/valibot';
import * as v from 'valibot';

export const genres = pgTable('genre', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
});

// Schemas
const nameRule = (schema: v.StringSchema<undefined>) =>
  v.pipe(schema, v.minLength(4, 'Name must be at least 4 characters.'));

export const genreSelectSchema = createSelectSchema(genres);
export const genreInsertSchema = createInsertSchema(genres, { name: nameRule });
export const genreUpdateSchema = createUpdateSchema(genres, { name: nameRule });

const genreWithBookSchema = v.object({
  ...genreSelectSchema.entries,
  totalBooks: v.number(),
});

// Types
export type Genre = v.InferOutput<typeof genreSelectSchema>;
export type GenreWithBook = v.InferOutput<typeof genreWithBookSchema>;
