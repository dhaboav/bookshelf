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
        update: 'bg-gold/10 border-gold/20 text-gold hover:bg-gold/20',
        destructive: 'border-red-600/20 bg-red-600/10 text-red-500 hover:bg-red-600/20',
      },
    },
    defaultVariants: {
      variant: 'update',
    },
  },
);

interface Props extends VariantProps<typeof formButtonVariants> {
  formID: string;
  isOpen: boolean;
  onClose: (open: boolean) => void;
  isPending: boolean;

  title: string;
  description?: string;

  actionTrigger: React.ReactNode;
  submitButtonLabel?: string;
  children?: React.ReactNode;
}

export const ItemDialog = ({
  formID,
  isOpen,
  onClose,
  isPending,
  children,
  submitButtonLabel = 'Save',
  variant = 'update',
  ...props
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {props.actionTrigger}
      <DialogContent className="bg-sidebar max-h-[85vh] overflow-y-auto lg:max-h-[95vh] lg:max-w-xl">
        <DialogTitle className="font-display text-foreground text-xl">{props.title}</DialogTitle>
        <DialogDescription className="text-foreground/60 mt-2 text-sm">{props.description}</DialogDescription>

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
            variant="default"
            className={cn(formButtonVariants({ variant }))}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {submitButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
