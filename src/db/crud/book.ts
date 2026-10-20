'use server';

import { count, eq, ilike, sql } from 'drizzle-orm';
import { cacheTag, updateTag } from 'next/cache';
import { safeParse } from 'valibot';

import { db } from '@/db/drizzle';
import { author, book, genre } from '@/db/schema';
import { BookFormInput, bookInsertSchema, bookUpdateSchema } from '@/db/validators/book';
import { imageDelete, imageRenaming, imageSave } from '@/utils/image-service';

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

export async function getBookById(bookId: number) {
  const [result] = await db
    .select({
      id: book.id,
      title: book.title,
      isbn: book.isbn,
      description: book.description,
      coverImg: book.cover_img,
      totalPages: book.total_pages,
      publishedYear: book.published_year,
      authorName: author.name,
      genreName: genre.name,
    })
    .from(book)
    .leftJoin(author, eq(book.author_id, author.id))
    .leftJoin(genre, eq(book.genre_id, genre.id))
    .where(eq(book.id, bookId));

  return { data: result ?? null };
}

export async function addBook(bookFormData: BookFormInput) {
  const image = bookFormData.cover_img;
  let filename: string | null = null;
  let savedFilename: string | null = null;

  // Generate filename
  if (image instanceof File && image.size > 0) {
    filename = imageRenaming(image);
  } else if (typeof image === 'string') {
    filename = image;
  }

  const parsed = safeParse(bookInsertSchema, {
    ...bookFormData,
    cover_img: filename,
  });
  if (!parsed.success) return { success: false, message: 'Please enter a valid input.' };

  try {
    // Saved file first
    if (image instanceof File && image.size > 0 && filename) {
      const result = await imageSave(image, filename);
      if (!result.success) return { success: false, message: result.message };
      savedFilename = filename;
    }

    await db.insert(book).values(parsed.output);
    updateTag('books');
    updateTag('authors');
    updateTag('genres');
    return { success: true, message: 'Book added successfully.' };
  } catch (error) {
    // In case of error deleted saved img
    if (savedFilename) {
      const deleted = await imageDelete(savedFilename);
      if (!deleted) console.error('Image cleanup failed:', savedFilename);
    }

    console.error('Failed to add book:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

export async function updateBook(id: number, bookFormData: BookFormInput) {
  const image = bookFormData.cover_img;
  let cover_img = image;
  let newFilename: string | null = null;

  /// Generate filename in case of book cover update
  if (image instanceof File && image.size > 0) {
    newFilename = imageRenaming(image);

    if (!newFilename) {
      return { success: false, message: 'Unsupported image type.' };
    }

    cover_img = newFilename;
  }

  const parsed = safeParse(bookUpdateSchema, {
    ...bookFormData,
    cover_img,
  });

  if (!parsed.success) {
    return { success: false, message: 'Please enter a valid input.' };
  }

  let savedFilename: string | null = null;

  try {
    const [existingBook] = await db
      .select({ cover_img: book.cover_img })
      .from(book)
      .where(eq(book.id, id))
      .limit(1);

    if (!existingBook) {
      return { success: false, message: 'Book not found.' };
    }

    // Saved newest book cover
    if (image instanceof File && image.size > 0 && newFilename) {
      const result = await imageSave(image, newFilename);

      if (!result.success) {
        return { success: false, message: result.message };
      }

      savedFilename = newFilename;
    }

    await db.update(book).set(parsed.output).where(eq(book.id, id));

    // Automatic deleted old one when db success
    if (savedFilename && existingBook.cover_img && existingBook.cover_img !== savedFilename) {
      const deleted = await imageDelete(existingBook.cover_img);

      if (!deleted) {
        console.error('Failed to delete old cover:', existingBook.cover_img);
      }
    }

    updateTag('books');
    updateTag('authors');
    updateTag('genres');
    return { success: true, message: 'Book updated successfully.' };
  } catch (error) {
    // In case of error deleted saved img
    if (savedFilename) {
      const deleted = await imageDelete(savedFilename);
      if (!deleted) console.error('Failed to clean up new cover:', savedFilename);
    }
    console.error('Failed to update book:', error);
    return { success: false, message: 'Failed to update book.' };
  }
}

export async function deleteBook(id: number) {
  try {
    const [existingBook] = await db
      .select({ cover_img: book.cover_img })
      .from(book)
      .where(eq(book.id, id))
      .limit(1);

    if (!existingBook) {
      return { success: false, message: 'Book not found.' };
    }
    await db.delete(book).where(eq(book.id, id));

    // Delete book cover.
    if (existingBook.cover_img) {
      const deleted = await imageDelete(existingBook.cover_img);

      if (!deleted) {
        console.error('Failed to delete cover image:', existingBook.cover_img);
      }
    }

    updateTag('books');
    updateTag('authors');
    updateTag('genres');

    return { success: true, message: 'Book deleted successfully.' };
  } catch (error) {
    console.error('Failed to delete book:', error);
    return { success: false, message: 'Failed to delete book.' };
  }
}
