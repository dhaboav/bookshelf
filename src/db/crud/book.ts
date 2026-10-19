'use server';

import { count, eq, ilike } from 'drizzle-orm';
import { cacheTag, updateTag } from 'next/cache';
import { safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { book } from '@/db/schema';
import { BookFormInput, bookInsertSchema, bookUpdateSchema } from '@/db/validators/book';
import { ImageService } from '@/utils/image-service';

export async function getBooks(page: number = 1, limit: number = 12, query?: string) {
  'use cache';
  cacheTag('books');

  const offset = (page - 1) * limit;
  const trimmedQuery = query?.trim();
  const hasQuery = Boolean(trimmedQuery && trimmedQuery.length > 0);

  const [items, totalResult] = await Promise.all([
    db.query.book.findMany({
      offset: offset,
      limit: limit,
      ...(hasQuery && {
        where: {
          title: {
            ilike: `%${trimmedQuery}%`,
          },
        },
      }),
      orderBy: { created_at: 'desc' },
      with: {
        author: true,
        genre: true,
      },
    }),

    db
      .select({ count: count(book.id) })
      .from(book)
      .where(hasQuery ? ilike(book.title, `%${trimmedQuery}%`) : undefined),
  ]);

  const totalItems = totalResult[0]?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    data: items,
    metadata: {
      currentPage: page,
      totalPage: totalPages,
      limit: limit,
    },
  };
}

export async function addBook(bookFormData: BookFormInput) {
  let cover_img = bookFormData.cover_img;
  if (cover_img instanceof File) {
    const imageResult = await ImageService(cover_img);
    if (!imageResult.success) return { success: false, message: imageResult.message };
    cover_img = imageResult.message; // In case of success, the message here means filename path.
  }

  const parsed = safeParse(bookInsertSchema, { ...bookFormData, cover_img });
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.insert(book).values(parsed.output);
    updateTag('books');
    updateTag('authors');
    updateTag('genres');
    return { success: true, message: 'Book added successfully.' };
  } catch (error: any) {
    console.error('Database error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}

export async function updateBook(id: number, bookFormData: BookFormInput) {
  let cover_img = bookFormData.cover_img;
  if (cover_img instanceof File) {
    const imageResult = await ImageService(cover_img);
    if (!imageResult.success) return { success: false, message: imageResult.message };
    cover_img = imageResult.message; // In case of success, the message here means filename path.
  }

  const parsed = safeParse(bookUpdateSchema, { ...bookFormData, cover_img });
  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  try {
    await db.update(book).set(parsed.output).where(eq(book.id, id));
    updateTag('books');
    updateTag('authors');
    updateTag('genres');
    return { success: true, message: 'Book updated successfully.' };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, message: 'Failed to update book.' };
  }
}

export async function deleteBook(id: number) {
  try {
    await db.delete(book).where(eq(book.id, id));
    updateTag('books');
    updateTag('authors');
    updateTag('genres');
    return { success: true, message: 'Book deleted successfully.' };
  } catch (error) {
    return { success: false, message: 'Failed to delete book.' };
  }
}
