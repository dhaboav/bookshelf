import { useSearchParams } from 'next/navigation';

import { PaginationProps } from './types';

function usePagination({ currentPage, pageCount }: PaginationProps) {
  const searchParams = useSearchParams();

  const buildPageUrl = (targetPage: number) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    queryParams.set('page', targetPage.toString());
    return `?${queryParams.toString()}`;
  };

  // Function to get the page items to display in the pagination
  const calculateVisiblePages = () => {
    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(pageCount, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return {
    visiblePages: calculateVisiblePages(),
    buildUrl: buildPageUrl,
    previousPage: {
      href: buildPageUrl(Math.max(1, currentPage - 1)),
      isDisabled: currentPage <= 1,
    },
    nextPage: {
      href: buildPageUrl(Math.min(pageCount, currentPage + 1)),
      isDisabled: currentPage >= pageCount,
    },
  };
}

export { usePagination };
