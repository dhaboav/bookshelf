'use client';

import { MenuIcon } from 'lucide-react';

// import { Suspense } from 'react';

import { Button } from '@/ui/button';
import { useSidebar } from '@/ui/sidebar';

// import { MobileSearchBar, SearchBar } from './search-bar';

export function Navbar() {
  const { toggleSidebar } = useSidebar();
  // const searchBarVariants = [
  //   { Component: SearchBar, className: 'hidden md:block' },
  //   { Component: MobileSearchBar, className: 'block md:hidden' },
  // ];

  return (
    <nav className="flex h-(--header-height) md:py-8 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 bg-background z-1">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 justify-between">
        <Button onClick={toggleSidebar} variant="ghost" size="icon" className="md:hidden">
          <MenuIcon />
        </Button>

        {/* <Suspense>
          {searchBarVariants.map(({ Component, className }, index) => (
            <div key={index} className={className}>
              <Component />
            </div>
          ))}
        </Suspense> */}
      </div>
    </nav>
  );
}
