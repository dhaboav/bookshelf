import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useMemo, useState, type ReactNode } from 'react';

interface PaginationWrapperProps<T> {
    items: T[];
    itemsPerPage?: number;
    renderItem: (item: T) => ReactNode;
    gridClassName?: string;
}

const getVisiblePages = (currentPage: number, totalPages: number) => {
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
};

const PaginationWrapper = <T,>({
    items,
    itemsPerPage = 6,
    renderItem,
    gridClassName = 'grid grid-cols-1 gap-4 lg:grid-cols-3',
}: PaginationWrapperProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Pages controller
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = items.slice(startIndex, startIndex + itemsPerPage);
    const visiblePages = useMemo(
        () => getVisiblePages(currentPage, totalPages),
        [currentPage, totalPages],
    );

    if (items.length === 0) return null;

    return (
        <div className="my-4 lg:mb-0">
            <ul className={gridClassName}>
                {currentItems.map((item, index) => (
                    <li key={index} className="list-none">
                        {renderItem(item)}
                    </li>
                ))}
            </ul>

            {totalPages > 1 && (
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                className={currentPage === 1 ? 'hidden' : 'cursor-pointer'}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                            />
                        </PaginationItem>

                        {visiblePages.map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={currentPage === page}
                                    onClick={() => setCurrentPage(page)}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                className={currentPage === totalPages ? 'hidden' : 'cursor-pointer'}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default PaginationWrapper;
