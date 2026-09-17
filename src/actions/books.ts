'use server';
import { db } from '@/db/drizzle';

export const getBooks = async () => {
  return await db.query.books.findMany({
    with: {
      author: true,
      genre: true,
    },
  });
};

export type Book = Awaited<ReturnType<typeof getBooks>>[number];
