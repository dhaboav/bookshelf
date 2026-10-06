'use server';

import { count, eq, ilike } from 'drizzle-orm';
import { cacheTag, updateTag } from 'next/cache';
import { InferInput, safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { authorInsertSchema, authorUpdateSchema, authors } from '@/schemas/authors';
import { books } from '@/schemas/books';

async function getAuthors(page: number = 1, limit: number = 12, query?: string) {
  'use cache';
  cacheTag('authors');

  const offset = (page - 1) * limit;
  const trimmedQuery = query?.trim();
  const hasQuery = Boolean(trimmedQuery && trimmedQuery.length > 0);

  const [items, totalItem] = await Promise.all([
    db
      .select({
        id: authors.id,
        name: authors.name,
        totalBooks: count(books.id),
      })
      .from(authors)
      .leftJoin(books, eq(books.genre_id, authors.id))
      .where(hasQuery ? ilike(authors.name, `%${trimmedQuery}%`) : undefined)
      .groupBy(authors.id)
      .limit(limit)
      .offset(offset),

    db.select({ count: count() }).from(authors),
  ]);

  const totalItems = totalItem[0]?.count || 0;
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

async function getAllAuthors() {
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

export { getAuthors, getAllAuthors, addAuthor, updateAuthor, deleteAuthor };
