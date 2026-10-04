import { BookCard } from '@/components/book/BookCard';
import { getAuthors } from '@/db/crud/authors';
import { getBooks } from '@/db/crud/books';
import { getGenres } from '@/db/crud/genres';

export default async function Home() {
  const [books, genres, authors] = await Promise.all([getBooks(), getGenres(), getAuthors()]);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 py-12">
      {books.map((book) => (
        <BookCard key={book.id} book={book} genres={genres} authors={authors} />
      ))}
    </div>
  );
}
