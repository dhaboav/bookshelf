import { authorsQueryOptions } from '@/entities/authors';
import { DeleteAuthor, UpdateAuthor } from '@/features/authors';
import type { Search } from '@/shared/model';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Route = createFileRoute('/_layout/author')({
  validateSearch: (search: Record<string, unknown>): Search => {
    return {
      q: (search.q as string) || undefined,
    };
  },
  component: Authors,
  head: () => ({
    meta: [
      {
        title: 'Authors - Bookshelf',
      },
    ],
  }),
});

function Authors() {
  const { q } = Route.useSearch();
  const { data: authors } = useQuery(authorsQueryOptions);

  // Search
  const filteredAuthors = useMemo(() => {
    if (!authors || !q) return authors || [];

    return authors.filter((author) => author.author?.includes(q));
  }, [authors, q]);

  if (!authors || authors.length === 0) {
    return (
      <div className="my-8 text-center">
        <h3 className="text-2xl font-semibold text-gray-700">No author found!</h3>
      </div>
    );
  }

  return (
    <>
      {filteredAuthors.length === 0 ? (
        <div className="my-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-700">No results found for "{q}"</h3>
        </div>
      ) : (
        <Table className="mt-8">
          <TableCaption>A list of authors.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Books</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAuthors.map((data) => (
              <TableRow key={data.id}>
                <TableCell className="font-mono text-slate-500">{data.id}</TableCell>
                <TableCell className="font-medium">{data.author}</TableCell>
                <TableCell className="font-medium">{data.total_books}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <UpdateAuthor author={data} onSuccess={() => {}} />
                    <DeleteAuthor id={data.id} onSuccess={() => {}} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
