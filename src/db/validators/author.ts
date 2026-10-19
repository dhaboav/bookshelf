import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-orm/valibot';
import * as v from 'valibot';

import { author } from '@/db/schema';

const authorSelectSchema = createSelectSchema(author);
export const authorInsertSchema = createInsertSchema(author, {
  name: (schema) => v.pipe(schema, v.minLength(4, 'Name must be at least 4 characters.')),
});
export const authorUpdateSchema = createUpdateSchema(author, {
  name: (schema) => v.pipe(schema, v.minLength(4, 'Name must be at least 4 characters.')),
});

export const authorWithTotalBooksSchema = v.object({
  ...authorSelectSchema.entries,
  totalBooks: v.number(),
});

// DB
export type AuthorInsert = v.InferInput<typeof authorInsertSchema>;
export type AuthorUpdate = v.InferInput<typeof authorUpdateSchema>;

// Types
export type Author = typeof author.$inferSelect;
export type AuthorWithBook = v.InferOutput<typeof authorWithTotalBooksSchema>;
