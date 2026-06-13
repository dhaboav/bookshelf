import { Button, Dialog, DialogContent, DialogTrigger } from '@/shared/ui';
import { Plus } from 'lucide-react';

interface DialogCustomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const DialogCustom = ({ open, onOpenChange, children, className }: DialogCustomProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="bg-gold/10 border-gold/20 text-gold hover:bg-gold/20 h-8 w-8 cursor-pointer rounded-full border"
        >
          <Plus className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={className}>{children}</DialogContent>
    </Dialog>
  );
};
