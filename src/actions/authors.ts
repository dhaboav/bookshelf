'use server';
import { db } from '@/db/drizzle';
import { authorInsertSchema, authors } from '@/db/schema/authors';
import { books } from '@/db/schema/books';
import { count, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const addAuthor = async (name: string) => {
  const parsed = authorInsertSchema.safeParse({ name });
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(authors).values(parsed.data);
    revalidatePath('/authors');
    return { success: true, message: 'Author added successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
};

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
export const updateAuthor = async (id: number, name: string) => {
  await db.update(authors).set({ name: name }).where(eq(authors.id, id));
  revalidatePath('/authors');
};

export const deleteAuthor = async (id: number) => {
  await db.delete(authors).where(eq(authors.id, id));
  revalidatePath('/authors');
};
