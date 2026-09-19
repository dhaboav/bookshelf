'use server';
import { db } from '@/db/drizzle';
import { books } from '@/db/schema/books';
import { genres } from '@/db/schema/genres';
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
  await db.insert(genres).values({ name: name });
  revalidatePath('/genres');
};

export const updateGenre = async (id: number, name: string) => {
  await db.update(genres).set({ name: name }).where(eq(genres.id, id));
  revalidatePath('/genres');
};

export const deleteGenre = async (id: number) => {
  await db.delete(genres).where(eq(genres.id, id));
  revalidatePath('/genres');
};
