import { DeleteGenre, UpdateGenre } from '@/features/genres';
import {
  EmptyState,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui';
import { useGenresPage } from '../lib/useGenresPage';

export const GenresPage = () => {
  const { q, genres, filteredGenres } = useGenresPage();

  if (!genres?.length) return <EmptyState message="No genre found!" />;
  if (!filteredGenres.length) return <EmptyState message={`No results found for "${q}"`} />;

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
        {filteredGenres.map(({ id, genre, total_books }) => (
          <TableRow key={id}>
            <TableCell className="font-mono text-slate-500">{id}</TableCell>
            <TableCell className="font-medium">{genre}</TableCell>
            <TableCell className="font-medium">{total_books}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <UpdateGenre genre={{ id, genre, total_books }} onSuccess={() => {}} />
                <DeleteGenre id={id} onSuccess={() => {}} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
