'use client';

import { ItemForm } from '@/components/item/item-form';
import { InputField } from '@/components/shared-form-fields';

function GenreCreateForm({ actionType }: { actionType: any }) {
  return (
    <ItemForm
      initialData={{ name: '' }}
      entity="genre"
      action="create"
      onSubmit={(values) => actionType(values)}
    >
      {(form) => <InputField of={form} path="name" label="name" placeholder="Genre's name" />}
    </ItemForm>
  );
}

export { GenreCreateForm };
