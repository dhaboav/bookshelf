'use client';

import { Form, Field as FormischField, SubmitHandler, reset, useForm } from '@formisch/react';
import { SearchIcon, XIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as v from 'valibot';

import { Button } from '@/ui/button';
import { Field } from '@/ui/field';
import { InputGroup, InputGroupButton, InputGroupInput } from '@/ui/input-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';

const SearchSchema = v.object({
  search: v.pipe(v.string(), v.minLength(3, 'Please enter minimum 3 characters')),
});

function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const form = useForm({
    schema: SearchSchema,
    initialInput: {
      search: '',
    },
  });

  const handleParams = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSubmit: SubmitHandler<typeof SearchSchema> = (value) => {
    handleParams(value.search);
  };

  return (
    <Form of={form} id="search-form" onSubmit={handleSubmit}>
      <FormischField of={form} path={['search']}>
        {(field) => (
          <Field data-invalid={field.errors !== null}>
            <InputGroup className="bg-white! text-black px-2 max-w-3xs">
              <InputGroupInput
                {...field.props}
                placeholder="Search (min. 3 chars)"
                className="w-full"
                aria-invalid={field.errors !== null}
                value={field.input ?? ''}
              />

              <InputGroupButton
                size="icon-xs"
                className={`text-red-600 ${field.input && field.input.length > 0 ? 'visible' : 'invisible'}`}
                onClick={() => {
                  handleParams('');
                  reset(form);
                }}
              >
                <XIcon />
              </InputGroupButton>

              <InputGroupButton variant="secondary" aria-label="Search" type="submit" form="search-form">
                <SearchIcon />
              </InputGroupButton>
            </InputGroup>
          </Field>
        )}
      </FormischField>
    </Form>
  );
}

function MobileSearchBar() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button size="icon" variant="outline">
            <SearchIcon />
          </Button>
        }
      />
      <PopoverContent sideOffset={10}>
        <SearchBar />
      </PopoverContent>
    </Popover>
  );
}

export { MobileSearchBar, SearchBar };
