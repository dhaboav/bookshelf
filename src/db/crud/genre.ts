'use server';

import { count, eq } from 'drizzle-orm';
import { InferInput, safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { book, genre } from '@/db/schema';
import { genreInsertSchema, genreUpdateSchema } from '@/db/validators/genre';

export async function getGenres() {
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

    return { success: true, message: 'Genre updated successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to update genre.' };
  }
}

export async function deleteGenre(id: number) {
  try {
    await db.delete(genre).where(eq(genre.id, id));
    return { success: true, message: 'Genre deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete genre.' };
  }
}
