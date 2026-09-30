'use server';

import { count, eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { InferInput, safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { books } from '@/db/schema/books';
import { genreInsertSchema, genreUpdateSchema, genres } from '@/db/schema/genres';

const getGenres = unstable_cache(
  async () => {
    return await db
      .select({
        id: genres.id,
        name: genres.name,
        totalBooks: count(books.id),
      })
      .from(genres)
      .leftJoin(books, eq(books.genre_id, genres.id))
      .groupBy(genres.id);
  },
  ['genres-with-bookcount'],
  { tags: ['genres'] },
);

async function addGenre(data: InferInput<typeof genreInsertSchema>) {
  const parsed = safeParse(genreInsertSchema, data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(genres).values(parsed.output);
    revalidateTag('genres', 'max');
    revalidatePath('/genres');
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
    revalidateTag('genres', 'max');
    revalidatePath('/genres');
    return { success: true, message: 'Genre updated successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to update genre.' };
  }
}

async function deleteGenre(id: number) {
  try {
    await db.delete(genres).where(eq(genres.id, id));
    revalidateTag('genres', 'max');
    revalidatePath('/genres');
    return { success: true, message: 'Genre deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete genre.' };
  }
}

export { getGenres, addGenre, updateGenre, deleteGenre };
