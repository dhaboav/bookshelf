import type { BookPublic } from '@/entities/books';
import { API_URL } from '@/shared/api';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const booksQueryOptions = queryOptions({
  queryKey: ['books'],
  queryFn: async (): Promise<BookPublic[]> => {
    const res = await fetch(`${API_URL}/books/`);
    if (!res.ok) throw new Error('Failed to fetch books from the server');
    return res.json();
  },
});

export const useGetBooks = () => {
  return useQuery(booksQueryOptions);
};
