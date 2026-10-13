'use client';

import { Form, SubmitHandler, useForm } from '@formisch/react';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';

import { ActionType, EntityType, schemas } from '@/schemas/registry';
import { Button } from '@/ui/button';
import { DialogTrigger } from '@/ui/dialog';
import { toast } from '@/ui/toast';

import { ItemDialog } from './item-dialog';

interface ItemFormProps<T extends EntityType> {
  entity: T;
  action: ActionType<T> & string;
  initialData: Record<string, any>;
  onSubmit: (values: any) => Promise<{ success?: boolean; message?: string }>;
  children: (formInstance: any) => ReactNode;
}

export function ItemForm<T extends EntityType>({
  entity,
  action,
  initialData,
  onSubmit,
  children,
}: ItemFormProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const activeSchema = (schemas as Record<string, any>)[entity][action];

  const form = useForm({
    schema: activeSchema,
    initialInput: initialData,
  });

  const handleFormSubmit: SubmitHandler<typeof activeSchema> = async (values) => {
    setIsPending(true);

    try {
      const response = await onSubmit(values);

      toast.add({
        type: response.success ? 'success' : 'warning',
        description: response.message || (response.success ? 'Berhasil diperbarui' : 'Gagal memperbarui'),
      });

      if (response.success) setIsOpen(false);
    } catch {
      toast.add({ type: 'error', description: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsPending(false);
    }
  };

  const entityName = entity.charAt(0).toUpperCase() + entity.slice(1);
  const actionName = action.charAt(0).toUpperCase() + action.slice(1);
  const formId = `form-${action}-${entity}`;

  return (
    <ItemDialog
      formID={formId}
      isOpen={isOpen}
      onClose={setIsOpen}
      isPending={isPending}
      title={`${actionName} ${entityName}`}
      description={`Ubah data ${entity} pada form di bawah ini.`}
      variant={action as 'create' | 'update'}
      actionTrigger={
        <DialogTrigger
          render={
            <Button
              variant={action === 'create' ? 'create' : 'ghost'}
              size={action === 'create' ? 'default' : 'icon'}
            >
              {action === 'create' ? (
                <div className="flex items-center gap-1">
                  <PlusIcon />
                  <span>{`Add ${entityName}`}</span>
                </div>
              ) : (
                <PencilIcon />
              )}
            </Button>
          }
        />
      }
    >
      <Form of={form} id={formId} onSubmit={handleFormSubmit}>
        {children(form)}
      </Form>
    </ItemDialog>
  );
}
