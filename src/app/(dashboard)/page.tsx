import { BookCard } from '@/components/book/BookCard';
import { getBooks } from '@/db/crud/books';

export default async function Home() {
  const books = await getBooks();
  return books.map((book) => <BookCard key={book.id} book={book} />);
}
