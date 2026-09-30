/**
 * @file shared-form-fields.tsx
 * @description A collection of shared form field components built specifically
 * for integration with the **Formisch** state management library and Shadcn UI components.
 *
 * Important Note:
 * These components rely entirely on `FormischField` from `@formisch/react`
 * and are not compatible with other form libraries (such as React Hook Form or Formik)
 * without modifying their internal render props implementation.
 */
import { Field as FormischField } from '@formisch/react';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/ui/combobox';
import { Field, FieldError, FieldLabel } from '@/ui/field';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';

interface Props {
  of: any;
  path: string;
  label: string;
  placeholder?: string;
  className?: string;
}

interface InputProps extends Props {
  type?: string;
}

interface ComboboxProps extends Props {
  items: Array<{ value: any; label: string }>;
}

function InputField({ of, path, label, placeholder, type = 'text' }: InputProps) {
  return (
    <FormischField of={of} path={[path]}>
      {(field) => (
        <Field data-invalid={field.errors !== null}>
          <FieldLabel htmlFor={label} className="text-foreground/60 text-sm">
            {label.toUpperCase()}
          </FieldLabel>
          <Input
            {...field.props}
            id={label}
            type={type}
            value={(field.input ?? '') as any}
            aria-invalid={field.errors !== null}
            placeholder={placeholder}
            autoComplete="off"
          />
          {field.errors && <FieldError errors={field.errors.map((message) => ({ message }))} />}
        </Field>
      )}
    </FormischField>
  );
}

function TextareaField({ of, path, label, placeholder, className }: Props) {
  return (
    <FormischField of={of} path={[path]}>
      {(field) => (
        <Field data-invalid={field.errors !== null}>
          <FieldLabel htmlFor={label}>{label.toUpperCase()}</FieldLabel>
          <Textarea
            {...field.props}
            id={label}
            value={(field.input ?? '') as any}
            aria-invalid={field.errors !== null}
            placeholder={placeholder}
            autoComplete="off"
            className={className}
          />
          {field.errors && <FieldError errors={field.errors.map((message) => ({ message }))} />}
        </Field>
      )}
    </FormischField>
  );
}

function ComboboxField({ of, path, label, items, placeholder }: ComboboxProps) {
  return (
    <FormischField of={of} path={[path]}>
      {(field) => (
        <Field data-invalid={field.errors !== null}>
          <FieldLabel htmlFor={label}>{label.toUpperCase()}</FieldLabel>
          <Combobox
            id={label}
            value={(field.input ?? '') as any}
            items={items}
            onValueChange={field.onChange}
          >
            <ComboboxInput placeholder={placeholder} aria-invalid={field.errors !== null} />
            <ComboboxContent>
              <ComboboxEmpty>No Items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          {field.errors && <FieldError errors={field.errors.map((message) => ({ message }))} />}
        </Field>
      )}
    </FormischField>
  );
}

export { InputField, TextareaField, ComboboxField };
