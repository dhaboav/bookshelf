import { AuthorsPage } from '@/pages/authors';
import type { Search } from '@/shared/model';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/author')({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: (search.q as string) || undefined,
  }),
  component: AuthorsPage,
  head: () => ({
    meta: [{ title: 'Authors - Bookshelf' }],
  }),
});
