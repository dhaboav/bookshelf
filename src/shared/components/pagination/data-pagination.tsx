'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/ui/pagination';

import { PaginationProps } from './types';
import { usePagination } from './use-pagination';

function DataPagination({ currentPage, pageCount }: PaginationProps) {
  const { visiblePages, buildUrl, previousPage, nextPage } = usePagination({ currentPage, pageCount });

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={previousPage.href}
            aria-disabled={previousPage.isDisabled}
            className={previousPage.isDisabled ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {visiblePages.map((pageNumber) => {
          const isActive = currentPage === pageNumber;

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink href={buildUrl(pageNumber)} isActive={isActive}>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={nextPage.href}
            aria-disabled={nextPage.isDisabled}
            className={nextPage.isDisabled ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export { DataPagination };
