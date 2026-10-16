import { VariantProps, cva } from 'class-variance-authority';
import { cn } from 'cn';

import { Button } from '@/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/ui/dialog';
import { Spinner } from '@/ui/spinner';

const formButtonVariants = cva(
  'h-11 cursor-pointer rounded-xl border px-6 text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        create: 'bg-green-600 border-gold/20 text-gold hover:bg-green-700',
        update: 'bg-blue-600 border-blue-500/20 text-white hover:bg-blue-700',
        delete: 'border-destructive/20 bg-destructive/10 text-red-500 hover:bg-destructive/20',
      },
    },
    defaultVariants: {
      variant: 'create',
    },
  },
);

interface ItemDialogProps extends VariantProps<typeof formButtonVariants> {
  formID: string;
  isOpen: boolean;
  onClose: (open: boolean) => void;
  isPending: boolean;
  title: string;
  description?: string;
  actionTrigger: React.ReactNode;
  children?: React.ReactNode;
}

export const ItemDialog = ({
  formID,
  isOpen,
  onClose,
  isPending,
  title,
  description,
  variant = 'create',
  actionTrigger,
  children,
}: ItemDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {actionTrigger}

      <DialogContent className="max-h-[85vh] overflow-y-auto lg:max-h-[95vh] lg:max-w-xl">
        <DialogTitle className="font-display text-foreground text-xl">{title}</DialogTitle>

        {description && (
          <DialogDescription className="text-foreground/60 mt-2 text-sm">{description}</DialogDescription>
        )}

        <div className="space-y-4 my-4">{children}</div>

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
            {isPending && <Spinner data-icon="inline-start" />}
            {title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
