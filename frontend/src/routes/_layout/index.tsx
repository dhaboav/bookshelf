import type { BookPublic } from '@/client';
import { BookCard } from '@/components/books/BookCard';
import ErrorComponent from '@/components/layouts/Error';
import PaginationWrapper from '@/components/layouts/PaginationWrapper';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

const booksQueryOptions = {
    queryKey: ['books'],
    queryFn: async (): Promise<BookPublic[]> => {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/books/get`);

        if (!response.ok) {
            throw new Error('Failed to fetch books from the server');
        }

        return response.json();
    },
};

function loadingPage() {
    return (
        <div className="flex min-h-100 flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            <p className="animate-pulse text-gray-500">Loading your library...</p>
        </div>
    );
}

export const Route = createFileRoute('/_layout/')({
    component: Books,
    pendingComponent: loadingPage,
    errorComponent: ErrorComponent,
});

export default function Books() {
    const { data: books } = useSuspenseQuery(booksQueryOptions);
    if (!books || books.length === 0) {
        return (
            <div className="my-8 text-center">
                <h3 className="text-2xl font-semibold text-gray-700">No book found!</h3>
            </div>
        );
    }

    return (
        <div>
            <PaginationWrapper
                items={books}
                itemsPerPage={12}
                renderItem={(book) => <BookCard {...book} />}
            />
        </div>
    );
}
