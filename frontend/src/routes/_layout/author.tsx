import { authorsQueryOptions } from '@/api/author';
import DeleteAuthor from '@/components/authors/DeleteAuthor';
import EditAuthor from '@/components/authors/EditAuthor';

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

export const Route = createFileRoute('/_layout/author')({
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
  const { data: authors } = useQuery(authorsQueryOptions);
  if (!authors || authors.length === 0) {
    return (
      <div className="my-8 text-center">
        <h3 className="text-2xl font-semibold text-gray-700">No author found!</h3>
      </div>
    );
  }

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
        {authors.map((author) => (
          <TableRow key={author.id}>
            <TableCell className="font-mono text-slate-500">{author.id}</TableCell>
            <TableCell className="font-medium">{author.author}</TableCell>
            <TableCell className="font-medium">30</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <EditAuthor author={author} />
                <DeleteAuthor id={author.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
