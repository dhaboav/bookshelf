import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/valibot';
import * as v from 'valibot';

export const authors = pgTable('author', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
});

// Schemas
const nameRule = (schema: v.StringSchema<undefined>) =>
  v.pipe(schema, v.minLength(4, 'Name must be at least 4 characters.'));

export const authorSelectSchema = createSelectSchema(authors);
export const authorInsertSchema = createInsertSchema(authors, { name: nameRule });
export const authorUpdateSchema = createUpdateSchema(authors, { name: nameRule });

const authorWithBookSchema = v.object({
  ...authorSelectSchema.entries,
  totalBooks: v.number(),
});

// Types
export type AuthorWithBook = v.InferOutput<typeof authorWithBookSchema>;
