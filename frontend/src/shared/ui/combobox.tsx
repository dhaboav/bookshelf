import { cn } from '@/shared/lib/utils';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface ComboboxFieldProps {
  name?: string;
  items: Array<{ id: number | string; label: string }>;
  value: number | string | null | undefined;
  onChange: (value: any) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}

export function Combobox({
  name,
  items = [],
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
}: ComboboxFieldProps) {
  const [open, setOpen] = React.useState(false);
  const selectedItem = items.find((item) => item.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          id={name}
          className="text-muted-foreground w-full justify-between truncate font-normal"
        >
          <span className={cn('truncate', selectedItem && 'text-white')}>
            {selectedItem ? selectedItem.label : placeholder}
          </span>
          <ChevronDownIcon className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0"
        align="start"
        style={{
          width: 'var(--radix-popover-trigger-width)',
          minWidth: 'var(--radix-popover-trigger-width)',
        }}
      >
        <Command style={{ width: '100%' }}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList
            className={cn(
              'max-h-40 overflow-y-auto overscroll-contain',
              '[&::-webkit-scrollbar]:w-0.5',
              '[&::-webkit-scrollbar-track]:bg-transparent',
              '[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30',
              'hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50',
            )}
            onWheel={(e) => {
              e.stopPropagation();
            }}
          >
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => {
                    onChange(item.id);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <span className="truncate">{item.label}</span>
                  <CheckIcon
                    className={cn('size-4', value === item.id ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
