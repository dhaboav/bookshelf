'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { EditIcon } from 'lucide-react';
import { useState, useTransition } from 'react';

interface Props {
  id: number;
  label: string;
  initialName: string;
  onUpdate: (id: number, name: string) => Promise<void>;
}

export const ItemUpdate = ({ id, label, initialName, onUpdate }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);

  const handleUpdate = () => {
    startTransition(async () => {
      await onUpdate(id, name);
      setOpen(false);
    });
  };

  const handleClose = () => {
    setOpen(false);
    setName(initialName);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setName(initialName);
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer bg-transparent text-gray-400"
          >
            <EditIcon />
          </Button>
        }
      />

      <DialogContent className="bg-sidebar h-auto max-h-[85vh] overflow-y-auto px-6 lg:max-h-[95vh] lg:max-w-2xl">
        <DialogTitle className="font-display text-foreground text-xl">Update {label}</DialogTitle>
        <DialogDescription className="text-foreground/60 mt-2 text-sm">
          Fill out the form below to update {label.toLowerCase()}.
        </DialogDescription>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground/80 text-sm font-medium">
            {label} Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()} name...`}
            autoComplete="off"
          />
        </div>

        <DialogFooter className="border-border/10 flex shrink-0 flex-row gap-3 border-t py-6">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={handleClose}
            className="text-foreground/60 hover:text-foreground h-11 cursor-pointer rounded-xl border border-white/10 px-6 text-sm font-medium transition-colors hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={handleUpdate}
            className="bg-primary flex h-11 flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-xl text-sm font-medium tracking-wide text-white transition-all"
          >
            {isPending && <Spinner data-icon="inline-start" />}
            <span>{isPending ? 'Saving...' : 'Update'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
