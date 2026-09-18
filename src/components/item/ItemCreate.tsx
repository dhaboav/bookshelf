'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { PlusIcon } from 'lucide-react';
import { useState, useTransition } from 'react';

interface Props {
  label: string;
  onCreate: (name: string) => Promise<void>;
}

export const ItemCreate = ({ label, onCreate }: Props) => {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      await onCreate(name);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="icon"
            className="bg-gold/10 border-gold/20 text-gold hover:bg-gold/20 h-8 w-8 cursor-pointer rounded-full border"
          >
            <PlusIcon />
          </Button>
        }
      />

      <DialogContent className="bg-sidebar px-6">
        <DialogTitle className="font-display text-foreground text-xl">Add {label}</DialogTitle>
        <DialogDescription className="text-foreground/60 mt-2 text-sm">
          Fill out the form below to add {label.toLowerCase()}.
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
            onClick={handleCreate}
            className="bg-gold/10 border-gold/20 text-gold hover:bg-gold/20 flex h-11 flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-xl border text-sm font-medium tracking-wide transition-all"
          >
            {isPending && <Spinner data-icon="inline-start" />}
            <span>{isPending ? 'Creating...' : 'Create'}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
