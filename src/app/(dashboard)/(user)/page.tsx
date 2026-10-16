import { BookCard } from '@/app/(dashboard)/(user)/book-card';
import { getBooks } from '@/db/crud/books';
import { NoResult } from '@/shared/components/no-result';
import { DataPagination } from '@/shared/components/pagination/data-pagination';

interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
  }>;
}

export const instant = false;

export default async function Homepage({ searchParams }: Props) {
  const { page = '1', limit = '12', q = '' } = await searchParams;

  const { metadata, data } = await getBooks(Number(page), Number(limit), q);

  if (data.length === 0) {
    return (
      <div className="py-12">
        <NoResult query={q} placeholder="book" />
      </div>
    );
  }

  return (
    <div className="py-12 ">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 pb-6">
        {data.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      <DataPagination currentPage={metadata.currentPage} pageCount={metadata.totalPage} />
    </div>
  );
}
