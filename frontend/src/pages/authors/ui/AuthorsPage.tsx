import { DeleteAuthor, UpdateAuthor } from '@/features/authors';
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
import { useAuthorsPage } from '../lib/useAuthorsPage';

export const AuthorsPage = () => {
  const { q, authors, filteredAuthors } = useAuthorsPage();

  if (!authors?.length) return <EmptyState message="No author found!" />;
  if (!filteredAuthors.length) return <EmptyState message={`No results found for "${q}"`} />;

  return (
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
        {filteredAuthors.map(({ id, author, total_books }) => (
          <TableRow key={id}>
            <TableCell className="font-mono text-slate-500">{id}</TableCell>
            <TableCell className="font-medium">{author}</TableCell>
            <TableCell className="font-medium">{total_books}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <UpdateAuthor author={{ id, author, total_books }} onSuccess={() => {}} />
                <DeleteAuthor id={id} onSuccess={() => {}} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
