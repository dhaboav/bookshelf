'use client';

import { MenuIcon } from 'lucide-react';
import { Suspense } from 'react';

import { Button } from '@/ui/button';
import { useSidebar } from '@/ui/sidebar';

import { MobileSearchBar, SearchBar } from './search-bar';

export function Navbar() {
  const { toggleSidebar } = useSidebar();
  const searchBarVariants = [
    { Component: SearchBar, className: 'hidden md:block' },
    { Component: MobileSearchBar, className: 'block md:hidden' },
  ];

  return (
    <nav className="bg-background sticky top-0 flex h-15 w-full items-center justify-between z-11 border-b-2 px-4">
      <Button onClick={toggleSidebar} variant="ghost" size="icon" className="md:hidden">
        <MenuIcon />
      </Button>

      <div className="flex items-center gap-4">
        <Suspense>
          {searchBarVariants.map(({ Component, className }, index) => (
            <div key={index} className={className}>
              <Component />
            </div>
          ))}
        </Suspense>
      </div>
    </nav>
  );
}
