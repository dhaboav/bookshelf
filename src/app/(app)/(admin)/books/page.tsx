import { BookFormDialog } from '@/components/books/book-form-dialog';
import { PageHeader } from '@/components/page-header';
import { DataPagination } from '@/components/pagination/data-pagination';
import { PageLimitPagination } from '@/components/pagination/page-limit-pagination';
import { getAllAuthors } from '@/db/crud/author';
import { addBook, getBooks } from '@/db/crud/book';
import { getAllGenres } from '@/db/crud/genre';

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

  const [book, genreList, authorList] = await Promise.all([
    getBooks(Number(page), Number(limit), q),
    getAllGenres(),
    getAllAuthors(),
  ]);

  const genreOptions = genreList.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const authorOptions = authorList.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <div className="pt-5 gap-6 flex flex-col">
      <PageHeader
        title="Books"
        description="Manage your library inventory."
        action={
          <BookFormDialog
            genreOptions={genreOptions}
            authorOptions={authorOptions}
            onSubmitAction={addBook}
          />
        }
      />

      <DataTable data={book.data} className="h-125" genres={genreList} authors={authorList} />

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
