'use server';

import { count, eq } from 'drizzle-orm';
import { cacheTag, updateTag } from 'next/cache';
import { InferInput, safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { authorInsertSchema, authorUpdateSchema, authors } from '@/schemas/authors';
import { books } from '@/schemas/books';

async function getAuthors() {
  'use cache';
  cacheTag('authors');

  return await db
    .select({
      id: authors.id,
      name: authors.name,
      totalBooks: count(books.id),
    })
    .from(authors)
    .leftJoin(books, eq(books.author_id, authors.id))
    .groupBy(authors.id);
}

async function addAuthor(data: InferInput<typeof authorInsertSchema>) {
  const parsed = safeParse(authorInsertSchema, data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(authors).values(parsed.output);
    updateTag('authors');
    updateTag('books');
    return { success: true, message: 'Author added successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

async function updateAuthor(id: number, data: InferInput<typeof authorUpdateSchema>) {
  const parsed = safeParse(authorUpdateSchema, data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.update(authors).set(parsed.output).where(eq(authors.id, id));
    updateTag('authors');
    updateTag('books');
    return { success: true, message: 'Author updated successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to update author.' };
  }
}

async function deleteAuthor(id: number) {
  try {
    await db.delete(authors).where(eq(authors.id, id));
    updateTag('authors');
    updateTag('books');
    return { success: true, message: 'Author deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete author.' };
  }
}

export { getAuthors, addAuthor, updateAuthor, deleteAuthor };
