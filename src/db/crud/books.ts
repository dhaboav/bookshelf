'use server';

import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { InferInput, safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { bookInsertSchema, books } from '@/db/schema/books';

const getBooks = unstable_cache(
  async () => {
    return await db.query.books.findMany({
      with: {
        author: true,
        genre: true,
      },
    });
  },
  ['books-with-relations'],
  { tags: ['books'] },
);

async function addBook(data: InferInput<typeof bookInsertSchema>) {
  const parsed = safeParse(bookInsertSchema, data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(books).values(parsed.output);
    revalidateTag('books', 'max');
    revalidatePath('/books');
    return { success: true, message: 'Book added successfully.' };
  } catch (error: any) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

export { getBooks, addBook };
