import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const genres = pgTable('genre', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
});
