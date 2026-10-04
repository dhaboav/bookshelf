import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-orm/valibot';
import { StringSchema, minLength, pipe } from 'valibot';

export const authors = pgTable('author', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
});

// Schemas
const nameRule = (schema: StringSchema<undefined>) =>
  pipe(schema, minLength(4, 'Name must be at least 4 characters.'));

export const authorInsertSchema = createInsertSchema(authors, { name: nameRule });
export const authorUpdateSchema = createUpdateSchema(authors, { name: nameRule });
