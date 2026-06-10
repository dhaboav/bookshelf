import { genresQueryOptions } from '@/entities/genres';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

const routeApi = getRouteApi('/_layout/genre');

export const useGenresPage = () => {
  const { q } = routeApi.useSearch();
  const { data: genres } = useQuery(genresQueryOptions);

  const filteredGenres = useMemo(() => {
    if (!genres || !q) return genres || [];
    return genres.filter((genre) => genre.genre?.toLowerCase().includes(q.toLowerCase()));
  }, [genres, q]);

  return { q, genres, filteredGenres };
};
