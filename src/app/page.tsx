import { getBooks } from '@/actions/books';
import { BookCard } from '@/components/book/BookCard';

export default async function Home() {
  const books = await getBooks();
  return books.map((book) => <BookCard key={book.id} book={book} />);
}
