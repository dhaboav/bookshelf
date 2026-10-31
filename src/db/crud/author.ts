'use server';

import { count, eq } from 'drizzle-orm';
import { safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { author, book } from '@/db/schema';
import { AuthorInsert, AuthorUpdate, authorInsertSchema, authorUpdateSchema } from '@/db/validators/author';

export async function getAuthors() {
  return await db
    .select({
      id: author.id,
      name: author.name,
      totalBooks: count(book.id),
    })
    .from(author)
    .leftJoin(book, eq(book.author_id, author.id))
    .groupBy(author.id);
}

export async function addAuthor(authorFormData: AuthorInsert) {
  const parsed = safeParse(authorInsertSchema, authorFormData);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(author).values(parsed.output);
    return { success: true, message: 'Author added successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

export async function updateAuthor(id: number, authorFormData: AuthorUpdate) {
  const parsed = safeParse(authorUpdateSchema, authorFormData);
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.update(author).set(parsed.output).where(eq(author.id, id));
    return { success: true, message: 'Author updated successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to update author.' };
  }
}

export async function deleteAuthor(id: number) {
  try {
    await db.delete(author).where(eq(author.id, id));
    return { success: true, message: 'Author deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete author.' };
  }
}
