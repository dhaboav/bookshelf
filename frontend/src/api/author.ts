import type { AuthorPublic } from '@/client/types.gen';
import { API_URL } from './common';

export const authorsQueryOptions = {
  queryKey: ['author'],
  queryFn: async (): Promise<AuthorPublic[]> => {
    const response = await fetch(`${API_URL}/author/`);
    if (!response.ok) {
      throw new Error('Failed to fetch author from the server');
    }
    return response.json();
  },
  staleTime: 1000 * 60 * 60,
};
