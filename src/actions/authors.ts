'use server';
import { db } from '@/db/drizzle';
import { authors, books } from '@/db/schema';
import { count, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const getAuthorsWithBookCount = async () => {
  return await db
    .select({
      id: authors.id,
      name: authors.name,
      totalBooks: count(books.id),
    })
    .from(authors)
    .leftJoin(books, eq(books.author_id, authors.id))
    .groupBy(authors.id);
};

export const addAuthor = async (name: string) => {
  await db.insert(authors).values({ name: name });
  revalidatePath('/authors');
};

export const updateAuthor = async (id: number, name: string) => {
  await db.update(authors).set({ name: name }).where(eq(authors.id, id));
  revalidatePath('/authors');
};

export const deleteAuthor = async (id: number) => {
  await db.delete(authors).where(eq(authors.id, id));
  revalidatePath('/authors');
};
