import type { BookPublic } from '@/client';
import { BookCard } from '@/components/BookCard';
import { useEffect, useState } from 'react';

export default function Homepage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [books, setBooks] = useState<BookPublic[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/books/get`);
                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchData();
    }, [API_URL]);

    return (
        <>
            <ul className="my-12 grid grid-cols-3 gap-3">
                {books.map((book) => (
                    <li key={book.id} className="list-none">
                        <BookCard {...book} />
                    </li>
                ))}
            </ul>
        </>
    );
}
