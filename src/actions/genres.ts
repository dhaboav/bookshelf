'use server';
import { db } from '@/db/drizzle';
import { books } from '@/db/schema/books';
import { genreInsertSchema, genres, genreUpdateSchema } from '@/db/schema/genres';
import { count, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const getGenresWithBookCount = async () => {
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

export const addGenre = async (name: string) => {
  const parsed = genreInsertSchema.safeParse({ name });
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(genres).values(parsed.data);
    revalidatePath('/genres');
    return { success: true, message: 'Genre added successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
};

export const updateGenre = async (id: number, name: string) => {
  const parsed = genreUpdateSchema.safeParse({ name });
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.update(genres).set({ name: parsed.data.name }).where(eq(genres.id, id));
    revalidatePath('/genres');
    return { success: true, message: 'Genre updated successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to update genre.' };
  }
};

export const deleteGenre = async (id: number) => {
  try {
    await db.delete(genres).where(eq(genres.id, id));
    revalidatePath('/genres');
    return { success: true, message: 'Genre deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete genre.' };
  }
};
