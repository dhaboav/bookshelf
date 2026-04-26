import { deleteBookMutation } from '@/api/book';
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

import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface DeleteBookProps {
  id: number;
  onSuccess: () => void;
}

const DeleteBook = ({ id, onSuccess }: DeleteBookProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleSubmit } = useForm();

  const mutation = deleteBookMutation(id, () => {
    setIsOpen(false);
    onSuccess();
  });

  const onSubmit = () => {
    mutation.mutate(id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuItem
        variant="destructive"
        onSelect={(e) => e.preventDefault()}
        onClick={() => setIsOpen(true)}
      >
        <Trash />
        Delete
      </DropdownMenuItem>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              This book will be permanently deleted. Are you sure? You will not be able to undo this
              action.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2 lg:mt-0">
            <DialogClose asChild>
              <Button variant="ghost" type="button" disabled={mutation.isPending}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="lg:w-24"
              variant="destructive"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <div className="flex flex-row items-center gap-x-1">
                  <Spinner data-icon="inline-start" />
                  <span>Delete</span>
                </div>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBook;
