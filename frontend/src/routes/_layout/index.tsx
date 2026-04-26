import { booksQueryOptions } from '@/api/book';
import type { BookSearch } from '@/client';
import { BookCard } from '@/components/books/BookCard';
import ErrorComponent from '@/components/layouts/Error';
import PaginationWrapper from '@/components/layouts/PaginationWrapper';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

function loadingPage() {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      <p className="animate-pulse text-gray-500">Loading your library...</p>
    </div>
  );
}

export const Route = createFileRoute('/_layout/')({
  validateSearch: (search: Record<string, unknown>): BookSearch => {
    return {
      q: (search.q as string) || undefined,
    };
  },
  component: Books,
  pendingComponent: loadingPage,
  errorComponent: ErrorComponent,
});

export default function Books() {
  const { q } = Route.useSearch();
  const { data: books } = useSuspenseQuery(booksQueryOptions);

  // Search
  const filteredBooks = useMemo(() => {
    if (!books || !q) return books || [];

    const searchTerm = q;
    if (searchTerm.includes(';')) {
      const [authorPart, titlePart] = searchTerm.split(';').map((p) => p.trim());

      return books.filter((book) => {
        const authorMatch = !authorPart || book.author?.includes(authorPart);
        const titleMatch = !titlePart || book.title?.includes(titlePart);
        return authorMatch && titleMatch;
      });
    }

    return books.filter((book) => {
      return book.title?.includes(searchTerm) || (book.author?.includes(searchTerm) ?? false);
    });
  }, [books, q]);

  if (!books || books.length === 0) {
    return (
      <div className="my-8 text-center">
        <h3 className="text-2xl font-semibold text-gray-700">No book found!</h3>
      </div>
    );
  }

  return (
    <div>
      {filteredBooks.length === 0 ? (
        <div className="my-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-700">No results found for "{q}"</h3>
        </div>
      ) : (
        <PaginationWrapper
          items={filteredBooks}
          itemsPerPage={12}
          renderItem={(book) => <BookCard {...book} />}
        />
      )}
    </div>
  );
}
