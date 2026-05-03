import { genresQueryOptions } from '@/api/genre';
import DeleteGenre from '@/components/genres/DeleteGenre';
import EditGenre from '@/components/genres/EditGenre';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/genre')({
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
  const { data: genres } = useQuery(genresQueryOptions);
  if (!genres || genres.length === 0) {
    return (
      <div className="my-8 text-center">
        <h3 className="text-2xl font-semibold text-gray-700">No genre found!</h3>
      </div>
    );
  }

  return (
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
        {genres.map((data) => (
          <TableRow key={data.id}>
            <TableCell className="font-mono text-slate-500">{data.id}</TableCell>
            <TableCell className="font-medium">{data.genre}</TableCell>
            <TableCell className="font-medium">30</TableCell>
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
  );
}
