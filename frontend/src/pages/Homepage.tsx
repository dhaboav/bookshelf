import reactLogo from '@/assets/react.svg';
import AddBook from '@/components/AddBook';
import type BookProps from '@/components/BookCard';
import { BookCard } from '@/components/BookCard';
import { useEffect, useState } from 'react';

export default function Homepage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [books, setBooks] = useState<BookProps[]>([]);

    const fetchBooks = async () => {
        try {
            const response = await fetch(`${API_URL}/books/get`);
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [API_URL]);

    return (
        <>
            <nav className="sticky top-0 flex h-15 w-full items-center justify-between border-b-2 bg-white px-48">
                <div className="flex items-center gap-x-2">
                    <img
                        src={reactLogo}
                        className="animation-duration-[10s] animate-spin"
                        alt="Logo"
                    />
                    <h1 className="text-lg font-semibold">React Library</h1>
                </div>
                <AddBook onAddSuccess={fetchBooks} />
            </nav>

            <ul className="my-12 grid grid-cols-3 gap-3 px-48">
                {books.map((book) => (
                    <li key={book.id} className="list-none">
                        <BookCard {...book} onDeleteSuccess={fetchBooks} />
                    </li>
                ))}
            </ul>
        </>
    );
}
