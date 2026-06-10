import { BooksPage } from '@/pages/books';
import type { Search } from '@/shared/model';
import { ErrorComponent, LoadingComponent } from '@/shared/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/')({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: (search.q as string) || undefined,
  }),
  component: BooksPage,
  pendingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
});
