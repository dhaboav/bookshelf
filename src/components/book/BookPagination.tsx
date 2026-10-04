'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/ui/pagination';

import { usePagination } from './use-pagination';

interface BookPaginationProps {
  currentPage: number;
  totalPages: number;
}

function BookPagination({ currentPage, totalPages }: BookPaginationProps) {
  const { pages, createUrl, prev, next } = usePagination(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={prev.href}
            aria-disabled={prev.disabled}
            className={prev.disabled ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {pages.map((pageNum) => {
          const isActive = currentPage === pageNum;

          return (
            <PaginationItem key={pageNum}>
              <PaginationLink href={createUrl(pageNum)} isActive={isActive}>
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={next.href}
            aria-disabled={next.disabled}
            className={next.disabled ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export { BookPagination };
