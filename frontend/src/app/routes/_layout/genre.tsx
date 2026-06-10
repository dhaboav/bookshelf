import { GenresPage } from '@/pages/genres';
import type { Search } from '@/shared/model';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/genre')({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: (search.q as string) || undefined,
  }),
  component: GenresPage,
  head: () => ({
    meta: [{ title: 'Genres - Bookshelf' }],
  }),
});
