import { getAllAuthors } from '@/db/crud/authors';
import { addBook, getBooks } from '@/db/crud/books';
import { getAllGenres } from '@/db/crud/genres';
import { DataPagination } from '@/shared/components/pagination/data-pagination';
import { PageLimitPagination } from '@/shared/components/pagination/page-limit-pagination';

import { BookCreateForm } from './book-create-form';
import { DataTable } from './data-table';

interface BookListPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
  }>;
}

export const instant = false;
export default async function BookListPage({ searchParams }: BookListPageProps) {
  const { page = '1', limit = '12', q = '' } = await searchParams;

  const [book, genresList, authorsList] = await Promise.all([
    getBooks(Number(page), Number(limit), q),
    getAllGenres(),
    getAllAuthors(),
  ]);

  return (
    <div className="pt-5 gap-6 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span>Book</span>
          <span>Home / Book List</span>
        </div>
        <BookCreateForm actionType={addBook} authors={authorsList} genres={genresList} />
      </div>

      <DataTable data={book.data} className="h-125" genres={genresList} authors={authorsList} />

      <div className="flex gap-2 mx-auto">
        <PageLimitPagination className="hidden lg:flex" />
        <DataPagination
          currentPage={book.metadata.currentPage}
          pageCount={book.metadata.totalPage}
          isText={false}
          className="block"
        />
      </div>
    </div>
  );
}
