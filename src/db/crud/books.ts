'use server';

import { count, eq, ilike } from 'drizzle-orm';
import { cacheTag, updateTag } from 'next/cache';
import { InferInput, safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { bookInsertSchema, bookUpdateSchema, books } from '@/schemas/books';

async function getBooks(page: number = 1, limit: number = 12, query?: string) {
  'use cache';
  cacheTag('books');

  const offset = (page - 1) * limit;
  const trimmedQuery = query?.trim();
  const hasQuery = Boolean(trimmedQuery && trimmedQuery.length > 0);

  const [items, totalResult] = await Promise.all([
    db.query.books.findMany({
      offset: offset,
      limit: limit,
      ...(hasQuery && {
        where: {
          title: {
            ilike: `%${trimmedQuery}%`,
          },
        },
      }),
      orderBy: { created_at: 'desc' },
      with: {
        author: true,
        genre: true,
      },
    }),

    db
      .select({ count: count(books.id) })
      .from(books)
      .where(hasQuery ? ilike(books.title, `%${trimmedQuery}%`) : undefined),
  ]);

  const totalItems = totalResult[0]?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    data: items,
    metadata: {
      currentPage: page,
      totalPage: totalPages,
      limit: limit,
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
