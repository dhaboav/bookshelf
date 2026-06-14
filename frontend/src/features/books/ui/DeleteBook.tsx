import { useDeleteBook } from '@/features/books';
import { DropdownMenuItem, GenericDeleteDialog } from '@/shared/ui';
import { Trash } from 'lucide-react';
import { useState } from 'react';

interface DeleteBookProps {
  id: number;
  onSuccess: () => void;
}

export const DeleteBook = ({ id, onSuccess }: DeleteBookProps) => {
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
    <GenericDeleteDialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Delete Book"
      labelName="Book"
      isPending={isPending}
      onSubmit={handleDelete}
      triggerButton={
        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer"
        >
          <Trash /> Delete
        </DropdownMenuItem>
      }
    />
  );
};
