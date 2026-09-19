import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-orm/zod';

export const genres = pgTable('genre', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
});

// Schemas
export const genreInsertSchema = createInsertSchema(genres, {
  name: (schema) => schema.min(4, 'Name must be at least 4 characters.'),
});

export const genreUpdateSchema = createUpdateSchema(genres, {
  name: (schema) => schema.min(4, 'Name must be at least 4 characters.'),
});
