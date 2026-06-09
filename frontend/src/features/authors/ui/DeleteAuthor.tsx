import { useDeleteAuthor } from '@/features/authors';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
} from '@/shared/ui';

import { TrashIcon } from 'lucide-react';
import { useState } from 'react';

interface DeleteAuthorProps {
  id: number;
  onSuccess: () => void;
}

export const DeleteAuthor = ({ id, onSuccess }: DeleteAuthorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteAuthor, isPending } = useDeleteAuthor();

  const handleDelete = () => {
    deleteAuthor(id, {
      onSuccess: () => {
        setIsOpen(false);
        onSuccess();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive bg-transparent">
          <TrashIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete author</DialogTitle>
          <DialogDescription>
            This author will be permanently deleted. Are you sure? You will not be able to undo this
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
