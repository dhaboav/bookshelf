'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { InferInput, safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { bookInsertSchema, bookUpdateSchema, books } from '@/db/schema/books';

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
    revalidatePath('/genres');
    revalidatePath('/authors');
    revalidatePath('/books');
    return { success: true, message: 'Book added successfully.' };
  } catch (error: any) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

async function updateBook(id: number, data: InferInput<typeof bookUpdateSchema>) {
  const parsed = safeParse(bookUpdateSchema, data);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.update(books).set(parsed.output).where(eq(books.id, id));
    revalidateTag('books', 'max');
    revalidatePath('/genres');
    revalidatePath('/authors');
    revalidatePath('/books');
    return { success: true, message: 'Book updated successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to update book.' };
  }
}

async function deleteBook(id: number) {
  try {
    await db.delete(books).where(eq(books.id, id));
    revalidateTag('books', 'max');
    revalidatePath('/genres');
    revalidatePath('/authors');
    revalidatePath('/books');
    return { success: true, message: 'Book deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete book.' };
  }
}

export { getBooks, addBook, updateBook, deleteBook };
