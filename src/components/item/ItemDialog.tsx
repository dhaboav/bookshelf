import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

interface Props {
  label: string;
  open: boolean;
  setIsOpen: (open: boolean) => void;
  triggerBtn: React.ReactNode;
  children: React.ReactNode;
}

export const ItemDialog = ({ label, open, setIsOpen, triggerBtn, children }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      {triggerBtn}
      <DialogContent className="bg-sidebar px-6">
        <DialogTitle className="font-display text-foreground text-xl">{label}</DialogTitle>
        <DialogDescription className="text-foreground/60 mt-2 text-sm">
          Fill out the form below to {label.toLowerCase()}.
        </DialogDescription>
        <div className="space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
