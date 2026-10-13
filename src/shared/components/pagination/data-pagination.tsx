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

interface Option extends PaginationProps {
  isText?: boolean;
}

function DataPagination({ currentPage, pageCount, isText = true }: Option) {
  const { visiblePages, buildUrl, previousPage, nextPage } = usePagination({ currentPage, pageCount });

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={previousPage.href}
            text={isText ? 'Previous' : ''}
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
            text={isText ? 'Next' : ''}
            aria-disabled={nextPage.isDisabled}
            className={nextPage.isDisabled ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export { DataPagination };
