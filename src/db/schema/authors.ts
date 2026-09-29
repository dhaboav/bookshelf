import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-orm/valibot';
import { StringSchema, minLength, pipe } from 'valibot';

const authors = pgTable('author', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
});

// Schemas
const nameRule = (schema: StringSchema<undefined>) =>
  pipe(schema, minLength(4, 'Name must be at least 4 characters.'));
const authorInsertSchema = createInsertSchema(authors, { name: nameRule });
const authorUpdateSchema = createUpdateSchema(authors, { name: nameRule });

export { authors, authorInsertSchema, authorUpdateSchema };
