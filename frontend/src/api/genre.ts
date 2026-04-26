import type { GenrePublic } from '@/client/types.gen';
import { API_URL } from './common';

export const genresQueryOptions = {
  queryKey: ['genres'],
  queryFn: async (): Promise<GenrePublic[]> => {
    const response = await fetch(`${API_URL}/genre/`);
    if (!response.ok) {
      throw new Error('Failed to fetch genres from the server');
    }
    return response.json();
  },
  staleTime: 1000 * 60 * 60,
};
