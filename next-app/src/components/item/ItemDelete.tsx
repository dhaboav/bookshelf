'use client';

import { TrashIcon } from 'lucide-react';
import { useTransition } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Spinner } from '../ui/spinner';

interface Props {
  id: number;
  label: string;
  onDelete: (id: number) => Promise<void>;
}

export const ItemDelete = ({ id, label, onDelete }: Props) => {
  const [isPending, startTransition] = useTransition();
  const handleDelete = () => {
    startTransition(async () => {
      await onDelete(id);
    });
  };
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive cursor-pointer bg-transparent"
          >
            <TrashIcon />
          </Button>
        }
      ></DialogTrigger>

      <DialogContent className="bg-sidebar px-6">
        <DialogTitle className="font-display text-foreground text-xl">Delete {label}</DialogTitle>
        <DialogDescription className="text-foreground/60 mt-2 text-sm">
          This {label.toLowerCase()} will be permanently deleted. Are you sure? You will not be able
          to undo this action.
        </DialogDescription>
        <DialogFooter className="mt-6 flex flex-row gap-3">
          <DialogClose
            render={
              <Button
                variant="outline"
                disabled={isPending}
                className="text-foreground/60 hover:text-foreground h-11 cursor-pointer rounded-xl border border-white/10 px-6 text-sm font-medium transition-colors hover:bg-white/5"
              >
                Cancel
              </Button>
            }
          />
          <Button
            disabled={isPending}
            onClick={handleDelete}
            className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-xl border border-red-600/20 bg-red-600/10 text-sm font-medium tracking-wide text-red-500 transition-all hover:bg-red-600/20"
          >
            {isPending && <Spinner data-icon="inline-start" />}
            <span>{isPending ? 'Deleting...' : 'Delete'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
