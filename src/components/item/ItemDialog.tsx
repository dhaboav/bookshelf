import { VariantProps, cva } from 'class-variance-authority';
import { cn } from 'cn';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/ui/dialog';

import { Button } from '../ui/button';

interface Props {
  formID: string;
  isPending: boolean;
  label: string;
  open: boolean;
  setIsOpen: (open: boolean) => void;
  triggerBtn: React.ReactNode;
  children?: React.ReactNode;
}

const formButtonVariants = cva(
  '!flex !h-11 !flex-1 !cursor-pointer !items-center !justify-center !gap-x-2 !rounded-xl !border !text-sm !font-medium tracking-wide transition-all',
  {
    variants: {
      variant: {
        add: 'bg-gold/10 border-gold/20 text-gold hover:bg-gold/20',
        destructive: 'border-red-600/20 bg-red-600/10 text-red-500 hover:bg-red-600/20',
      },
    },
    defaultVariants: {
      variant: 'add',
    },
  },
);

export const ItemDialog = ({
  formID,
  isPending,
  label,
  open,
  setIsOpen,
  triggerBtn,
  children,
  variant = 'add',
}: Props & VariantProps<typeof formButtonVariants>) => {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      {triggerBtn}
      <DialogContent className="bg-sidebar max-h-[85vh] overflow-y-auto lg:max-h-[95vh] lg:max-w-xl">
        <DialogTitle className="font-display text-foreground text-xl">{label}</DialogTitle>
        <DialogDescription className="text-foreground/60 mt-2 text-sm">
          Fill out the form below to {label.toLowerCase()}.
        </DialogDescription>
        <div className="space-y-4">{children}</div>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                disabled={isPending}
                variant="outline"
                className="text-foreground/60 hover:text-foreground h-11 cursor-pointer rounded-xl border border-white/10 px-6 text-sm font-medium transition-colors hover:bg-white/5"
              >
                Cancel
              </Button>
            }
          />
          <Button
            type="submit"
            form={formID}
            disabled={isPending}
            className={cn(formButtonVariants({ variant }))}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
