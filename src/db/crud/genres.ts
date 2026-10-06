'use server';

import { count, eq, ilike } from 'drizzle-orm';
import { cacheTag, updateTag } from 'next/cache';
import { InferInput, safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { books } from '@/schemas/books';
import { genreInsertSchema, genreUpdateSchema, genres } from '@/schemas/genres';

async function getGenres(page: number = 1, limit: number = 12, query?: string) {
  'use cache';
  cacheTag('genres');

  const offset = (page - 1) * limit;
  const trimmedQuery = query?.trim();
  const hasQuery = Boolean(trimmedQuery && trimmedQuery.length > 0);

  const [items, totalItem] = await Promise.all([
    db
      .select({
        id: genres.id,
        name: genres.name,
        totalBooks: count(books.id),
      })
      .from(genres)
      .leftJoin(books, eq(books.genre_id, genres.id))
      .where(hasQuery ? ilike(genres.name, `%${trimmedQuery}%`) : undefined)
      .groupBy(genres.id)
      .limit(limit)
      .offset(offset),

    db.select({ count: count() }).from(genres),
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

async function getAllGenres() {
  'use cache';
  cacheTag('genres');

  return await db.select().from(genres);
}

async function addGenre(data: InferInput<typeof genreInsertSchema>) {
  const parsed = safeParse(genreInsertSchema, data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(genres).values(parsed.output);
    updateTag('genres');
    updateTag('books');
    return { success: true, message: 'Genre added successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

async function updateGenre(id: number, data: InferInput<typeof genreUpdateSchema>) {
  const parsed = safeParse(genreUpdateSchema, data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.update(genres).set(parsed.output).where(eq(genres.id, id));
    updateTag('genres');
    updateTag('books');
    return { success: true, message: 'Genre updated successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to update genre.' };
  }
}

async function deleteGenre(id: number) {
  try {
    await db.delete(genres).where(eq(genres.id, id));
    updateTag('genres');
    updateTag('books');
    return { success: true, message: 'Genre deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete genre.' };
  }
}

export { getGenres, getAllGenres, addGenre, updateGenre, deleteGenre };
