import { Suspense } from 'react';

import { BookCard } from '@/components/book/BookCard';
import { BookPagination } from '@/components/book/BookPagination';
import { getAuthors } from '@/db/crud/authors';
import { getBooks } from '@/db/crud/books';
import { getGenres } from '@/db/crud/genres';

interface Props {
  searchParams?: Promise<{
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

async function BookListContent({ searchParams }: Props) {
  const resolvedParams = await searchParams;

  const currentPage = Number(resolvedParams?.page) || 1;
  const size = Number(resolvedParams?.size) || 12;

  const [books, genres, authors] = await Promise.all([
    getBooks(currentPage, size),
    getGenres(),
    getAuthors(),
  ]);

  return (
    <div className="py-12">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 pb-6">
        {books.data.map((book) => (
          <BookCard key={book.id} book={book} genres={genres} authors={authors} />
        ))}
      </div>

      <BookPagination currentPage={books.meta.current_page} totalPages={books.meta.total_page} />
    </div>
  );
}
