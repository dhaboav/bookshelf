'use server';
import { db } from '@/db/drizzle';
import { bookInsertSchema, books } from '@/db/schema/books';
import { revalidatePath } from 'next/cache';
import z from 'zod';

export const getBooks = async () => {
  return await db.query.books.findMany({
    with: {
      author: true,
      genre: true,
    },
  });
};

export type BookInput = z.infer<typeof bookInsertSchema>;
export const addBook = async (data: BookInput) => {
  const parsed = bookInsertSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(books).values(parsed.data);
    revalidatePath('/books');
    return { success: true, message: 'Book added successfully.' };
  } catch (error: any) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
};

export type Book = Awaited<ReturnType<typeof getBooks>>[number];
