import { Suspense } from 'react';

import { addBook } from '@/db/crud/book';

import { BookFormDialog } from '../book/book-form-dialog';
import { MobileSearchBar, SearchBar } from '../search-bar';
import { MobileMenuButton } from './_components/mobile-menu-button';
import { ThemeToggle } from './_components/theme-toggle';

export function AppHeader() {
  return (
    <header className="h-(--header-height) flex px-4 lg:px-6 items-center">
      <MobileMenuButton />
      <div className="flex items-center justify-between w-full">
        <p>ReadQuest</p>
        <Suspense>
          <SearchBar className="hidden md:flex" />
        </Suspense>
        <div className="flex min-w-0 items-center gap-1 lg:gap-3">
          <MobileSearchBar className="flex md:hidden" />
          <ThemeToggle />
          <BookFormDialog onSubmitAction={addBook} />
        </div>
      </div>
    </header>
  );
}
