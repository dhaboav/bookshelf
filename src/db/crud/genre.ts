'use server';

import { count, eq, ilike } from 'drizzle-orm';
import { cacheTag, updateTag } from 'next/cache';
import { InferInput, safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { book, genre } from '@/db/schema';
import { genreInsertSchema, genreUpdateSchema } from '@/db/validators/genre';

export async function getGenres(page: number = 1, limit: number = 12, query?: string) {
  'use cache';
  cacheTag('genres');

  const offset = (page - 1) * limit;
  const trimmedQuery = query?.trim();
  const hasQuery = Boolean(trimmedQuery && trimmedQuery.length > 0);

  const [items, totalItem] = await Promise.all([
    db
      .select({
        id: genre.id,
        name: genre.name,
        totalBooks: count(book.id),
      })
      .from(genre)
      .leftJoin(book, eq(book.genre_id, genre.id))
      .where(hasQuery ? ilike(genre.name, `%${trimmedQuery}%`) : undefined)
      .groupBy(genre.id)
      .limit(limit)
      .offset(offset),

    db.select({ count: count() }).from(genre),
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

export async function getAllGenres() {
  'use cache';
  cacheTag('genres');

  return await db
    .select({
      id: genre.id,
      name: genre.name,
      totalBooks: count(book.id),
    })
    .from(genre)
    .leftJoin(book, eq(book.genre_id, genre.id))
    .groupBy(genre.id);
}

export async function addGenre(data: InferInput<typeof genreInsertSchema>) {
  const parsed = safeParse(genreInsertSchema, data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(genre).values(parsed.output);
    updateTag('genres');
    updateTag('books');
    return { success: true, message: 'Genre added successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

export async function updateGenre(id: number, data: InferInput<typeof genreUpdateSchema>) {
  const parsed = safeParse(genreUpdateSchema, data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.update(genre).set(parsed.output).where(eq(genre.id, id));
    updateTag('genres');
    updateTag('books');
    return { success: true, message: 'Genre updated successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to update genre.' };
  }
}

export async function deleteGenre(id: number) {
  try {
    await db.delete(genre).where(eq(genre.id, id));
    updateTag('genres');
    updateTag('books');
    return { success: true, message: 'Genre deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete genre.' };
  }
}
