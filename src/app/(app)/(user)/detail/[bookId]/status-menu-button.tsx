'use client';

import { BookOpenIcon, BookmarkPlusIcon, ChevronRightIcon, CircleCheckIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const statuses = [
  {
    icon: BookmarkPlusIcon,
    label: 'Want to Read',
    value: 'want-to-read',
    description: 'Save it for later',
  },
  {
    icon: BookOpenIcon,
    label: 'Currently Reading',
    value: 'reading',
    description: 'Track your progress',
  },
  {
    icon: CircleCheckIcon,
    label: 'Finished',
    value: 'finished',
    description: "You've completed this book",
  },
] as const;

type ChoiceValues = (typeof statuses)[number]['value'];

function StatusOptionCard({
  item,
  selected,
  currentPage,
  totalPages,
  onPageChange,
}: {
  item: (typeof statuses)[number];
  selected: boolean;
  currentPage: string;
  totalPages: number;
  onPageChange: (page: string) => void;
}) {
  const { icon: Icon, label, value, description } = item;
  const isReading = value === 'reading';

  return (
    <Collapsible
      open={isReading && selected}
      className={`rounded-xl border transition-colors ${
        selected ? 'border-primary/50 bg-primary/5' : 'border-border'
      }`}
    >
      <Field orientation="horizontal" className="gap-3 p-3 md:gap-4 md:p-4">
        <FieldLabel htmlFor={value} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
          <Icon className="size-5 shrink-0" />

          <FieldContent className="min-w-0">
            <FieldTitle>{label}</FieldTitle>
            <FieldDescription>{description}</FieldDescription>
          </FieldContent>
        </FieldLabel>

        <RadioGroupItem id={value} value={value} className="sr-only" />

        {isReading && (
          <ChevronRightIcon className={`size-4 transition-transform ${selected ? 'rotate-90' : ''}`} />
        )}
      </Field>

      {isReading && (
        <CollapsibleContent className="px-3 pb-3">
          <Field>
            <FieldLabel htmlFor="current-page">Reading progress</FieldLabel>

            <InputGroup>
              <InputGroupInput
                id="current-page"
                type="number"
                min={0}
                max={totalPages}
                step={1}
                placeholder="Current page"
                value={currentPage}
                onChange={(event) => onPageChange(event.target.value)}
              />

              <InputGroupAddon align="inline-end">
                <InputGroupText>/ {totalPages} pages</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

export function StatusMenuButton({ totalPages = 1 }: { totalPages: number }) {
  const [status, setStatus] = useState<ChoiceValues>('want-to-read');
  const [currentPage, setCurrentPage] = useState('0');

  const isMobile = useIsMobile();

  function handleSave() {
    const page = Number(currentPage);

    if (
      status === 'reading' &&
      (!currentPage.trim() || !Number.isInteger(page) || page < 0 || page > totalPages)
    ) {
      return;
    }

    console.log({
      status,
      currentPage: status === 'reading' ? page : null,
    });
  }

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button>
            <PlusIcon />
            Add to Library
          </Button>
        }
      ></SheetTrigger>

      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        showCloseButton={false}
        className="mx-auto w-full p-4 bg-background max-w-xl rounded-t-2xl md:max-w-2xl md:p-6 md:rounded-t-none lg:max-w-3xl"
      >
        <SheetTitle>Add to Library</SheetTitle>
        <SheetDescription>Save this book to your library and organize it your way.</SheetDescription>

        <RadioGroup
          value={status}
          onValueChange={(value) => setStatus(value as ChoiceValues)}
          className="w-full gap-2"
        >
          {statuses.map((item) => (
            <StatusOptionCard
              key={item.value}
              item={item}
              selected={status === item.value}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          ))}
        </RadioGroup>

        <Button className="mt-2 w-full" onClick={handleSave}>
          Save
        </Button>
      </SheetContent>
    </Sheet>
  );
}
