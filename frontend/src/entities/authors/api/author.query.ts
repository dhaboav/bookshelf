import { API_URL } from '@/shared/api';
import type { AuthorPublic } from '../model/types';

export const authorsQueryOptions = {
  queryKey: ['authors'],
  queryFn: async (): Promise<AuthorPublic[]> => {
    const res = await fetch(`${API_URL}/author/`);
    if (!res.ok) throw new Error('Failed to fetch author from the server');
    return res.json();
  },
  staleTime: 1000 * 60 * 60,
};
