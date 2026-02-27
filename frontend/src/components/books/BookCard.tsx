import { Calendar, CircleUserRound, ScrollText } from 'lucide-react';

import type { BookPublic } from '@/client';
import { BookActionsMenu } from '@/components/books/BookActionsMenu';

export function BookCard({ ...book }: BookPublic) {
    return (
        <div className="flex h-36 w-full flex-row items-center overflow-hidden">
            <div className="h-full w-24 shrink-0">
                <img
                    src="/cover.jpg"
                    alt="Book cover"
                    className="h-full w-full rounded-sm object-cover"
                />
            </div>

            <div className="flex w-full flex-col justify-center overflow-hidden px-4 py-2">
                <div className="flex flex-row items-center justify-between">
                    <p className="text-primary line-clamp-1 text-xs font-semibold">
                        # {book.genre.toUpperCase()}
                    </p>
                    <BookActionsMenu book={book} />
                </div>

                <h3 className="truncate text-lg font-bold">{book.title}</h3>
                <p className="line-clamp-2 text-sm font-light text-gray-700 dark:text-gray-300">
                    {book.description}
                </p>
                <div className="mt-1.5 grid grid-cols-3 items-center">
                    <div className="flex flex-row items-center gap-x-1">
                        <CircleUserRound className="w-4" />
                        <span className="text-[10px] font-semibold">{book.author}</span>
                    </div>

                    <div className="flex flex-row items-center gap-x-1">
                        <Calendar className="w-4" />
                        <span className="text-[10px] font-semibold">{book.published_year}</span>
                    </div>

                    <div className="flex flex-row items-center gap-x-1">
                        <ScrollText className="w-4" />
                        <span className="text-[10px] font-semibold">{book.total_pages} Pages</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
