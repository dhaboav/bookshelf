import { deleteGenreMutation } from '@/api/genre';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface DeleteGenreProps {
  id: number;
}

const DeleteGenre = ({ id }: DeleteGenreProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleSubmit } = useForm();

  const mutation = deleteGenreMutation(id, () => {
    setIsOpen(false);
  });

  const onSubmit = () => {
    mutation.mutate(id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive bg-transparent">
          <TrashIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Delete a genre</DialogTitle>
            <DialogDescription>
              This genre will be permanently deleted. Are you sure? You will not be able to undo
              this action.
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

export default DeleteGenre;
