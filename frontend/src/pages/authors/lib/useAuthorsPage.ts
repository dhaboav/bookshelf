import { authorsQueryOptions } from '@/entities/authors';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

const routeApi = getRouteApi('/_layout/author');

export const useAuthorsPage = () => {
  const { q } = routeApi.useSearch();
  const { data: authors } = useQuery(authorsQueryOptions);

  const filteredAuthors = useMemo(() => {
    if (!authors || !q) return authors || [];
    return authors.filter((author) => author.author?.toLowerCase().includes(q.toLowerCase()));
  }, [authors, q]);

  return { q, authors, filteredAuthors };
};
