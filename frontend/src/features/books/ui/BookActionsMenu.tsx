import type { BookPublic } from '@/entities/books';
import { DeleteBook } from '@/features/books/ui/DeleteBook';
import { UpdateBook } from '@/features/books/ui/UpdateBook';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';

interface BookActionsMenuProps {
  book: BookPublic;
}

export const BookActionsMenu = ({ book }: BookActionsMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-xs">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <UpdateBook book={book} onSuccess={() => setOpen(false)} />
        <DeleteBook id={book.id} onSuccess={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
