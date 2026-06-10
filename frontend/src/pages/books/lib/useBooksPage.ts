import { booksQueryOptions } from '@/entities/books';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

const routeApi = getRouteApi('/_layout/');

export const useBooksPage = () => {
  const { q } = routeApi.useSearch();
  const { data: books } = useSuspenseQuery(booksQueryOptions);

  const filteredBooks = useMemo(() => {
    if (!books || !q) return books || [];

    const searchTerm = q.toLowerCase();

    if (searchTerm.includes(';')) {
      const [authorPart, titlePart] = searchTerm.split(';').map((p) => p.trim());

      return books.filter((book) => {
        const authorMatch = !authorPart || book.author?.author?.toLowerCase().includes(authorPart);
        const titleMatch = !titlePart || book.title?.toLowerCase().includes(titlePart);
        return authorMatch && titleMatch;
      });
    }

    return books.filter(
      (book) =>
        book.title?.toLowerCase().includes(searchTerm) ||
        book.author?.author?.toLowerCase().includes(searchTerm),
    );
  }, [books, q]);

  return { q, books, filteredBooks };
};
