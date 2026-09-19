import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

interface Props {
  label: string;
  isPending: boolean;
  formId: string;
}

export const ItemDialogFooter = ({ label, isPending, formId }: Props) => {
  return (
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
        type="submit"
        disabled={isPending}
        form={formId}
        className="bg-gold/10 border-gold/20 text-gold hover:bg-gold/20 flex h-11 flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-xl border text-sm font-medium tracking-wide transition-all"
      >
        {isPending && <Spinner data-icon="inline-start" />}
        <span>{isPending ? `${label}ing...` : `${label}`}</span>
      </Button>
    </DialogFooter>
  );
};
