import { BookFormDialog } from '@/components/library/book/book-form-dialog';
import { BookTable } from '@/components/library/book/table/book-table';
import { PageHeader } from '@/components/page-header';
import { addBook, getBooks } from '@/db/crud/book';

export async function BookContent() {
  const books = await getBooks();
  return (
    <>
      <PageHeader
        title="Books"
        description="Manage your book list."
        action={<BookFormDialog onSubmitAction={addBook} />}
      />

      <BookTable initialData={books} />
    </>
  );
}
