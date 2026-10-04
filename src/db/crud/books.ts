'use server';

import { count, eq } from 'drizzle-orm';
import { cacheTag, updateTag } from 'next/cache';
import { InferInput, safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { bookInsertSchema, bookUpdateSchema, books } from '@/schemas/books';

async function getBooks(page: number = 1, size: number = 12) {
  'use cache';
  cacheTag('books');

  const offset = (page - 1) * size;
  const [items, totalResult] = await Promise.all([
    db.query.books.findMany({
      offset: offset,
      limit: size,
      orderBy: { created_at: 'desc' },
      with: {
        author: true,
        genre: true,
      },
    }),
    db.select({ count: count(books.id) }).from(books),
  ]);

  const total = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(total / size);

  return {
    data: items,
    meta: {
      current_page: page,
      total_page: totalPages,
      size: size,
    },
  };
}

async function addBook(data: InferInput<typeof bookInsertSchema>) {
  const parsed = safeParse(bookInsertSchema, data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(books).values(parsed.output);
    updateTag('books');
    updateTag('authors');
    updateTag('genres');
    return { success: true, message: 'Book added successfully.' };
  } catch (error: any) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

async function updateBook(id: number, data: InferInput<typeof bookUpdateSchema>) {
  const parsed = safeParse(bookUpdateSchema, data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.update(books).set(parsed.output).where(eq(books.id, id));
    updateTag('books');
    updateTag('authors');
    updateTag('genres');
    return { success: true, message: 'Book updated successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to update book.' };
  }
}

async function deleteBook(id: number) {
  try {
    await db.delete(books).where(eq(books.id, id));
    updateTag('books');
    updateTag('authors');
    updateTag('genres');
    return { success: true, message: 'Book deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete book.' };
  }
}

export { getBooks, addBook, updateBook, deleteBook };
