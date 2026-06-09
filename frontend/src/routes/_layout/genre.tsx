import { genresQueryOptions } from '@/features/genres/hooks/useGenreQueries';
import DeleteGenre from '@/features/genres/ui/DeleteGenre';
import EditGenre from '@/features/genres/ui/EditGenre';
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

export const Route = createFileRoute('/_layout/genre')({
  validateSearch: (search: Record<string, unknown>): Search => {
    return {
      q: (search.q as string) || undefined,
    };
  },
  component: Genres,
  head: () => ({
    meta: [
      {
        title: 'Genres - Bookshelf',
      },
    ],
  }),
});

function Genres() {
  const { q } = Route.useSearch();
  const { data: genres } = useQuery(genresQueryOptions);

  // Search
  const filteredGenres = useMemo(() => {
    if (!genres || !q) return genres || [];

    return genres.filter((genre) => genre.genre?.includes(q));
  }, [genres, q]);

  if (!genres || genres.length === 0) {
    return (
      <div className="my-8 text-center">
        <h3 className="text-2xl font-semibold text-gray-700">No genre found!</h3>
      </div>
    );
  }

  return (
    <>
      {filteredGenres.length === 0 ? (
        <div className="my-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-700">No results found for "{q}"</h3>
        </div>
      ) : (
        <Table className="mt-8">
          <TableCaption>A list of genres.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Genres</TableHead>
              <TableHead>Books</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGenres.map((data) => (
              <TableRow key={data.id}>
                <TableCell className="font-mono text-slate-500">{data.id}</TableCell>
                <TableCell className="font-medium">{data.genre}</TableCell>
                <TableCell className="font-medium">{data.total_books}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <EditGenre genre={data} />
                    <DeleteGenre id={data.id} />
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
