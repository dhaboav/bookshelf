import { BookCard } from '@/components/book/book-card';
import { getAllAuthors } from '@/db/crud/authors';
import { getBooks } from '@/db/crud/books';
import { getAllGenres } from '@/db/crud/genres';
import { NoResult } from '@/shared/components/no-result';
import { DataPagination } from '@/shared/components/pagination/data-pagination';

interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
  }>;
}

export default async function Homepage({ searchParams }: Props) {
  const { page = '1', limit = '12', q = '' } = await searchParams;

  const [books, genres, authors] = await Promise.all([
    getBooks(Number(page), Number(limit), q),
    getAllGenres(),
    getAllAuthors(),
  ]);

  if (books.data.length === 0) {
    return (
      <div className="py-12">
        <NoResult query={q} placeholder="book" />
      </div>
    );
  }

  return (
    <div className="py-12 ">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 pb-6">
        {books.data.map((book) => (
          <BookCard key={book.id} book={book} genres={genres} authors={authors} />
        ))}
      </div>

      <DataPagination currentPage={books.metadata.currentPage} pageCount={books.metadata.totalPage} />
    </div>
  );
}
