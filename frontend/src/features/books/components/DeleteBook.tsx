import { useDeleteBook } from '@/features/books/hooks/useBookQueries';
import { Trash } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';

interface DeleteBookProps {
  id: number;
  onSuccess: () => void;
}

const DeleteBook = ({ id, onSuccess }: DeleteBookProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteBook, isPending } = useDeleteBook();

  const handleDelete = () => {
    deleteBook(id, {
      onSuccess: () => {
        setIsOpen(false);
        onSuccess();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuItem
        variant="destructive"
        onSelect={(e) => e.preventDefault()}
        onClick={() => setIsOpen(true)}
      >
        <Trash /> Delete
      </DropdownMenuItem>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Book</DialogTitle>
          <DialogDescription>
            This book will be permanently deleted. Are you sure? You will not be able to undo this
            action.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2 lg:mt-0">
          <DialogClose asChild>
            <Button variant="ghost" type="button" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            className="lg:w-24"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            <div className="flex items-center gap-x-1">
              {isPending && <Spinner data-icon="inline-start" />}
              <span>{isPending ? 'Deleting...' : 'Delete'}</span>
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBook;
