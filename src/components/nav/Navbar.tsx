'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { AppSidebarTrigger } from '@/components/nav/AppSidebar';

import { MobileSearchBar, SearchBar } from './SearchBar';

export function Navbar() {
  const searchBarVariants = [
    { Component: SearchBar, className: 'hidden md:block' },
    { Component: MobileSearchBar, className: 'block md:hidden' },
  ];

  return (
    <nav className="bg-background sticky top-0 flex h-15 w-full items-center justify-between z-11 border-b-2 px-3 lg:px-48">
      <div className="flex items-center gap-x-2">
        <AppSidebarTrigger />
        <Link href="/" className="flex cursor-pointer items-center gap-x-2">
          <Image
            src="/react.svg"
            width={10}
            height={10}
            className="animation-duration-[10s] h-auto w-auto animate-spin"
            alt="Logo"
          />
          <h1 className="font-semibold lg:text-lg">Athenaeum</h1>
        </Link>
      </div>

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
