import { BookCard } from '@/components/book/book-card';
import { getBooks } from '@/db/crud/book';

export async function LatestUpdateSection() {
  const q = '';
  const { metadata, data } = await getBooks(Number(1), Number(10), q);
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {data.map((book) => (
        <div key={book.id}>
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}
