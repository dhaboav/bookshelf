import { Suspense } from 'react';

import { BookCard } from '@/components/book/BookCard';
import { getAuthors } from '@/db/crud/authors';
import { getBooks } from '@/db/crud/books';
import { getGenres } from '@/db/crud/genres';
import { DataPagination } from '@/shared/components/pagination/data-pagination';

interface Props {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    size?: string;
  }>;
}

export default function Homepage(props: Props) {
  return (
    <Suspense fallback={<div className="text-center py-30">Loading books...</div>}>
      <BookListContent searchParams={props.searchParams} />
    </Suspense>
  );
}

function NoResult({ query, placeholder }: { query: string; placeholder: string }) {
  return (
    <div className="border-border text-center rounded-xl border-4 border-dashed p-8 font-mono">
      <p className="text-sm text-slate-400">No {placeholder} found for</p>
      <span className="text-foreground block w-full truncate font-bold">
        "{query.length > 15 ? `${query.slice(0, 15)}...` : query}"
      </span>
    </div>
  );
}

async function BookListContent({ searchParams }: Props) {
  const resolvedParams = await searchParams;

  const params = {
    search: resolvedParams?.search || '',
    page: Number(resolvedParams?.page) || 1,
    size: Number(resolvedParams?.size) || 12,
  };

  const [books, genres, authors] = await Promise.all([
    getBooks(params.page, params.size, params.search),
    getGenres(),
    getAuthors(),
  ]);

  return (
    <div className="py-12">
      {books.data.length === 0 ? (
        <NoResult query={params.search} placeholder="book" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 pb-6">
            {books.data.map((book) => (
              <BookCard key={book.id} book={book} genres={genres} authors={authors} />
            ))}
          </div>

          <DataPagination currentPage={books.meta.current_page} pageCount={books.meta.total_page} />
        </>
      )}
    </div>
  );
}
