import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
} from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  useForm,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form';
import { z } from 'zod';

interface GenericInputFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  labelName: string;
  buttonLabel: string;
  schema: z.ZodObject<any, any>;
  onSubmit: (data: any) => void;
  isPending: boolean;
  defaultValues?: Record<string, any>;
  triggerButton: React.ReactNode;
  content: (props: {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
    control: Control<any>;
    setValue: UseFormSetValue<any>;
  }) => React.ReactNode;
}

export const GenericInputFormDialog = ({
  isOpen,
  onOpenChange,
  title,
  labelName,
  buttonLabel,
  schema,
  onSubmit,
  isPending,
  defaultValues = {},
  triggerButton,
  content,
}: GenericInputFormDialogProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) reset(defaultValues);
  }, [isOpen, defaultValues, reset]);

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="bg-sidebar h-auto max-h-[85vh] overflow-y-auto px-6 lg:max-h-[95vh] lg:max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="font-display text-foreground mb-12 text-2xl">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="sr-only">
              {`Fill out the form below to ${buttonLabel} ${labelName}.`}
            </DialogDescription>
          </DialogHeader>

          {content({ register, errors, control, setValue })}

          <DialogFooter className="border-border/10 flex shrink-0 flex-row gap-3 border-t py-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="text-foreground/60 hover:text-foreground h-11 cursor-pointer rounded-xl border border-white/10 px-6 text-sm font-medium transition-colors hover:bg-white/5"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-gold/10 border-gold/20 text-gold hover:bg-gold/20 flex h-11 flex-1 cursor-pointer items-center justify-center gap-x-2 rounded-xl border text-sm font-medium tracking-wide transition-all"
            >
              {isPending && <Spinner data-icon="inline-start" />}
              <span>{isPending ? 'Saving...' : buttonLabel}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
