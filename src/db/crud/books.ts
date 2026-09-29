'use server';

import { revalidatePath } from 'next/cache';
import { InferInput, safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { bookInsertSchema, books } from '@/db/schema/books';

async function getBooks() {
  return await db.query.books.findMany({
    with: {
      author: true,
      genre: true,
    },
  });
}

async function addBook(data: InferInput<typeof bookInsertSchema>) {
  const parsed = safeParse(bookInsertSchema, data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(books).values(parsed.output);
    revalidatePath('/books');
    return { success: true, message: 'Book added successfully.' };
  } catch (error: any) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

export { getBooks, addBook };
