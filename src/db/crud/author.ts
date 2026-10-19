'use server';

import { count, eq, ilike } from 'drizzle-orm';
import { cacheTag, updateTag } from 'next/cache';
import { InferInput, safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { author, book } from '@/db/schema';
import { AuthorInsert, AuthorUpdate, authorInsertSchema, authorUpdateSchema } from '@/db/validators/author';

export async function getAuthors(page: number = 1, limit: number = 12, query?: string) {
  'use cache';
  cacheTag('authors');

  const offset = (page - 1) * limit;
  const trimmedQuery = query?.trim();
  const hasQuery = Boolean(trimmedQuery && trimmedQuery.length > 0);

  const [items, totalItem] = await Promise.all([
    db
      .select({
        id: author.id,
        name: author.name,
        totalBooks: count(book.id),
      })
      .from(author)
      .leftJoin(book, eq(book.genre_id, author.id))
      .where(hasQuery ? ilike(author.name, `%${trimmedQuery}%`) : undefined)
      .groupBy(author.id)
      .limit(limit)
      .offset(offset),

    db.select({ count: count() }).from(author),
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

export async function getAllAuthors() {
  'use cache';
  cacheTag('authors');

  return await db
    .select({
      id: author.id,
      name: author.name,
      totalBooks: count(book.id),
    })
    .from(author)
    .leftJoin(book, eq(book.author_id, author.id))
    .groupBy(author.id);
}

export async function addAuthor(authorFormData: AuthorInsert) {
  const parsed = safeParse(authorInsertSchema, authorFormData);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(author).values(parsed.output);
    updateTag('authors');
    updateTag('books');
    return { success: true, message: 'Author added successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

export async function updateAuthor(id: number, authorFormData: AuthorUpdate) {
  const parsed = safeParse(authorUpdateSchema, authorFormData);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.update(author).set(parsed.output).where(eq(author.id, id));
    updateTag('authors');
    updateTag('books');
    return { success: true, message: 'Author updated successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to update author.' };
  }
}

export async function deleteAuthor(id: number) {
  try {
    await db.delete(author).where(eq(author.id, id));
    updateTag('authors');
    updateTag('books');
    return { success: true, message: 'Author deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete author.' };
  }
}
