import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-orm/zod';

export const authors = pgTable('author', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
});

// Schemas
export const authorInsertSchema = createInsertSchema(authors, {
  name: (schema) => schema.min(4, 'Name must be at least 4 characters.'),
});

export const authorUpdateSchema = createUpdateSchema(authors, {
  name: (schema) => schema.min(4, 'Name must be at least 4 characters.'),
});
