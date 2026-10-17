'use client';

import { Form, SubmitHandler, reset, useForm } from '@formisch/react';
import { PencilIcon, TagPlusIcon, UserPlusIcon } from 'lucide-react';
import { useState } from 'react';
import * as v from 'valibot';

import { InputField } from '@/components/shared-form-fields';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';

// ==========================================
// SCHEMAS & TYPES
// ==========================================

const ItemFormSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(4, 'Title must be at least 4 characters.'),
    v.maxLength(255, 'Title cannot exceed 255 characters.'),
  ),
});

type ItemFormInput = v.InferInput<typeof ItemFormSchema>;
type ItemFormOutput = v.InferOutput<typeof ItemFormSchema>;

interface ItemFormDialogProps {
  entityType: 'author' | 'genre';
  initialData?: ItemFormInput;
  onSubmitAction: (values: ItemFormOutput) => Promise<{ success?: boolean; message?: string }>;
}

// ==========================================
// COMPONENT
// ==========================================

export function ItemFormDialog({ entityType, initialData, onSubmitAction }: ItemFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isEditing = Boolean(initialData);
  const formActionTitle = isEditing ? 'Update' : 'Add';
  const formHtmlId = `${formActionTitle.toLowerCase()}-${entityType}-form`;
  const createIcon = entityType === 'author' ? <UserPlusIcon /> : <TagPlusIcon />;

  const form = useForm({
    schema: ItemFormSchema,
    initialInput: { name: initialData?.name ?? '' },
  });

  const handleFormSubmit: SubmitHandler<typeof ItemFormSchema> = async (values) => {
    try {
      const response = await onSubmitAction(values);
      toast.add({
        type: response.success ? 'success' : 'error',
        description:
          response.message ||
          (response.success ? `Success saving ${entityType}.` : `Failed saving ${entityType}.`),
      });

      setIsOpen(false);
      reset(form);
    } catch {
      toast.add({
        type: 'error',
        description: 'An unexpected system error occurred.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button variant={isEditing ? 'ghost' : 'default'} size={isEditing ? 'icon' : 'default'}>
            {isEditing ? <PencilIcon /> : createIcon}
            {!isEditing && <span> {`${formActionTitle} ${entityType}`} </span>}
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto lg:max-h-[95vh] lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {formActionTitle} {entityType}
          </DialogTitle>
          <DialogDescription>
            Provide the necessary details for this {entityType}. Make sure all required fields are filled out.
          </DialogDescription>
        </DialogHeader>

        <Form id={formHtmlId} of={form} onSubmit={handleFormSubmit}>
          <InputField of={form} path="name" label="Name" placeholder={`${entityType} Name`} />
        </Form>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                disabled={form.isSubmitting}
                variant="outline"
                onClick={() => reset(form)}
                className="text-foreground/60 hover:text-foreground h-11 cursor-pointer rounded-xl border border-white/10 px-6 text-sm font-medium transition-colors hover:bg-white/5"
              >
                Cancel
              </Button>
            }
          />
          <Button
            type="submit"
            form={formHtmlId}
            disabled={form.isSubmitting}
            className="h-11 cursor-pointer rounded-xl border px-6 text-sm font-medium transition-colors"
          >
            {form.isSubmitting && <Spinner data-icon="inline-start" />}
            {formActionTitle} {entityType}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
