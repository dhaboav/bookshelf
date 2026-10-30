import { Suspense } from 'react';

import { BookFormDialog } from '@/components/library/book/book-form-dialog';
import { BookTable } from '@/components/library/book/table/book-table';
import { PageHeader } from '@/components/page-header';
import { DataPagination } from '@/components/pagination/data-pagination';
import { PageLimitPagination } from '@/components/pagination/page-limit-pagination';
import { TabsContent } from '@/components/ui/tabs';
import { addBook, getBooks } from '@/db/crud/book';

export async function BookContent() {
  const book = await getBooks(1, 12);

  return (
    <TabsContent value="book" className="pt-5 gap-6 flex flex-col">
      <PageHeader
        title="Books"
        description="Manage your book list."
        action={<BookFormDialog onSubmitAction={addBook} />}
      />
      <BookTable data={book.data} />
      <Suspense>
        <div className="flex gap-2 mx-auto">
          <PageLimitPagination className="hidden lg:flex" />
          <DataPagination currentPage={1} pageCount={15} isText={false} className="block" />
        </div>
      </Suspense>
    </TabsContent>
  );
}
