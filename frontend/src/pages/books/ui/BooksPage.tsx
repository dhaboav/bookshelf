import { BookCard } from '@/entities/books';
import { BookActionsMenu } from '@/features/books';
import { EmptyState, PaginationWrapper } from '@/shared/ui';
import { useBooksPage } from '../lib/useBooksPage';

export const BooksPage = () => {
  const { q, books, filteredBooks } = useBooksPage();

  if (!books?.length) return <EmptyState message="No book found!" />;
  if (!filteredBooks.length) return <EmptyState message={`No results found for "${q}"`} />;

  return (
    <PaginationWrapper
      items={filteredBooks}
      itemsPerPage={12}
      renderItem={(book) => <BookCard book={book} actionsSlot={<BookActionsMenu book={book} />} />}
    />
  );
};
