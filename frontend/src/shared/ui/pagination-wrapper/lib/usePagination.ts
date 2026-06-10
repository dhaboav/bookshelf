import { useMemo, useState } from 'react';

const getVisiblePages = (currentPage: number, totalPages: number) => {
  let startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
};

export const usePagination = <T>(items: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  const visiblePages = useMemo(
    () => getVisiblePages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    visiblePages,
  };
};
