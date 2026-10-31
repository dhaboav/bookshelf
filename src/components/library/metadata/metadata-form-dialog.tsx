'use client';

import { Form, SubmitHandler, reset, useForm } from '@formisch/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

import { EntityType } from '@/components/library/metadata/types';

// ==========================================
// SCHEMAS & TYPES
// ==========================================

const MetadataFormSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(4, 'Title must be at least 4 characters.'),
    v.maxLength(255, 'Title cannot exceed 255 characters.'),
  ),
});

type MetadataFormInput = v.InferInput<typeof MetadataFormSchema>;
type MetadataFormOutput = v.InferOutput<typeof MetadataFormSchema>;

interface MetadataFormDialogProps {
  entityType: EntityType;
  initialData?: MetadataFormInput;
  onSubmitAction: (values: MetadataFormOutput) => Promise<{ success?: boolean; message?: string }>;
}

// ==========================================
// COMPONENT
// ==========================================

export function MetadataFormDialog({ entityType, initialData, onSubmitAction }: MetadataFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isEditing = Boolean(initialData);
  const formActionTitle = isEditing ? 'Update' : 'Add';
  const formHtmlId = `${formActionTitle.toLowerCase()}-${entityType}-form`;
  const createIcon = entityType === 'authors' ? <UserPlusIcon /> : <TagPlusIcon />;

  const form = useForm({
    schema: MetadataFormSchema,
    initialInput: { name: initialData?.name ?? '' },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: onSubmitAction,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [entityType] });
      }
    },
  });

  const handleFormSubmit: SubmitHandler<typeof MetadataFormSchema> = async (values) => {
    try {
      const response = await mutation.mutateAsync(values);
      toast.add({
        type: response.success ? 'success' : 'error',
        description:
          response.message ||
          (response.success ? `Success saving ${entityType}.` : `Failed saving ${entityType}.`),
      });

      if (response.success) {
        setIsOpen(false);
        reset(form);
      }
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
