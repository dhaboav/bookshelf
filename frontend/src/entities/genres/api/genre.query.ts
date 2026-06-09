import { API_URL } from '@/shared/api';
import type { GenrePublic } from '../model/types';

export const genresQueryOptions = {
  queryKey: ['genres'],
  queryFn: async (): Promise<GenrePublic[]> => {
    const res = await fetch(`${API_URL}/genre/`);
    if (!res.ok) throw new Error('Failed to fetch genre from the server');
    return res.json();
  },
  staleTime: 1000 * 60 * 60,
};
