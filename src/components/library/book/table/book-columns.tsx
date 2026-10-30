import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';

import { DeleteDialog } from '@/components/delete-dialog';
import { BookFormDialog } from '@/components/library/book/book-form-dialog';
import { DataTableFeatures } from '@/components/library/table-features';
import { deleteBook, updateBook } from '@/db/crud/book';
import { Book } from '@/db/validators/book';

const columnHelper = createColumnHelper<DataTableFeatures, Book>();
export function createColumns() {
  return columnHelper.columns([
    columnHelper.accessor('title', {
      header: 'Book',
      cell: (info) => {
        const book = info.row.original;
        return (
          <div className="flex items-center gap-3">
            <Image
              src={book.cover_img || '/cover.jpg'}
              width={1000}
              height={700}
              alt={book.title || 'Book cover'}
              className="h-12 w-9 rounded object-cover shadow-sm"
            />

            <div className="font-semibold">{book.title}</div>
          </div>
        );
      },
    }),
    columnHelper.accessor('isbn', {
      header: 'ISBN',
    }),
    columnHelper.accessor('author.name', {
      header: 'Author',
    }),
    columnHelper.accessor('genre.name', {
      header: 'Genre',
    }),
    columnHelper.accessor('published_year', {
      header: 'Published Year',
    }),
    columnHelper.accessor('created_at', {
      header: 'Added',
      cell: (info) => {
        const rawDate = info.getValue();
        if (!rawDate) return <span>-</span>;

        const formattedDate = new Date(rawDate).toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        return <span className="whitespace-nowrap text-xs font-mono">{formattedDate}</span>;
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const bookID = row.original.id;
        return (
          <div className="flex items-center gap-2">
            <BookFormDialog
              initialData={{
                isbn: row.original.isbn,
                title: row.original.title,
                cover_img: row.original.cover_img,
                published_year: row.original.published_year,
                total_pages: row.original.total_pages,
                author_id: row.original.author?.id,
                genre_id: row.original.genre?.id,
                description: row.original.description,
              }}
              onSubmitAction={(values) => updateBook(bookID, values)}
            />
            <DeleteDialog entityType="Book" onDeleteAction={() => deleteBook(bookID)} />
          </div>
        );
      },
    }),
  ]);
}
