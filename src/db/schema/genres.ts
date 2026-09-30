import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-orm/valibot';
import { StringSchema, minLength, pipe } from 'valibot';

export const genres = pgTable('genre', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
});

// Schemas
const nameRule = (schema: StringSchema<undefined>) =>
  pipe(schema, minLength(4, 'Name must be at least 4 characters.'));

export const genreInsertSchema = createInsertSchema(genres, { name: nameRule });
export const genreUpdateSchema = createUpdateSchema(genres, { name: nameRule });
