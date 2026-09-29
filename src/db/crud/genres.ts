'use server';
import { count, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import * as v from 'valibot';

import { db } from '@/db/drizzle';
import { books } from '@/db/schema/books';
import { genreInsertSchema, genreUpdateSchema, genres } from '@/db/schema/genres';

const getGenresWithBookCount = async () => {
  return await db
    .select({
      id: genres.id,
      name: genres.name,
      totalBooks: count(books.id),
    })
    .from(genres)
    .leftJoin(books, eq(books.genre_id, genres.id))
    .groupBy(genres.id);
};

const addGenre = async (name: string) => {
  const parsed = v.safeParse(genreInsertSchema, { name });
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(genres).values(parsed.output);
    revalidatePath('/genres');
    return { success: true, message: 'Genre added successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
};

const updateGenre = async (id: number, name: string) => {
  const result = v.safeParse(genreUpdateSchema, { name });

  if (!result.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.update(genres).set(result.output).where(eq(genres.id, id));
    revalidatePath('/genres');
    return { success: true, message: 'Genre updated successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to update genre.' };
  }
};

const deleteGenre = async (id: number) => {
  try {
    await db.delete(genres).where(eq(genres.id, id));
    revalidatePath('/genres');
    return { success: true, message: 'Genre deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete genre.' };
  }
};

export { addGenre, deleteGenre, getGenresWithBookCount, updateGenre };
