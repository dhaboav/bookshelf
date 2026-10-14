'use client';

import { ItemForm } from '@/components/item/item-form';
import { InputField } from '@/shared/components/shared-form-fields';

function AuthorCreateForm({ actionType }: { actionType: any }) {
  return (
    <ItemForm
      initialData={{ name: '' }}
      entity="author"
      action="create"
      onSubmit={(values) => actionType(values)}
    >
      {(form) => <InputField of={form} path="name" label="name" placeholder="Author name" />}
    </ItemForm>
  );
}

export { AuthorCreateForm };
