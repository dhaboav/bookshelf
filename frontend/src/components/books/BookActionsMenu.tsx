import type { BookPublic } from '@/client';
import DeleteBook from '@/components/books/DeleteBook';
import EditBook from '@/components/books/EditBook';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
        <EditBook book={book} onSuccess={() => setOpen(false)} />
        <DeleteBook id={book.id} onSuccess={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
