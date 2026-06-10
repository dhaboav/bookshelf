import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui';
import { usePagination } from '../lib/usePagination';

interface PaginationWrapperProps<T> {
  items: T[];
  itemsPerPage?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  gridClassName?: string;
}

export const PaginationWrapper = <T,>({
  items,
  itemsPerPage = 6,
  renderItem,
  gridClassName = 'grid grid-cols-1 gap-4 lg:grid-cols-3',
}: PaginationWrapperProps<T>) => {
  const { currentPage, setCurrentPage, totalPages, currentItems, visiblePages } = usePagination(
    items,
    itemsPerPage,
  );

  if (!items.length) return null;

  return (
    <div className="my-4 lg:mb-0">
      <div className={gridClassName}>
        {currentItems.map((item, index) => (
          <div key={index}>{renderItem(item, index)}</div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent className="select-none">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`cursor-pointer ${currentPage === 1 && 'pointer-events-none opacity-40'}`}
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`cursor-pointer ${currentPage === totalPages && 'pointer-events-none opacity-40'}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
