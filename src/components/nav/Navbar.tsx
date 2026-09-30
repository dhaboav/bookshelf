'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { AppSidebarTrigger } from '@/components/nav/AppSidebar';
import { addAuthor } from '@/db/crud/authors';
import { addBook } from '@/db/crud/books';
import { addGenre } from '@/db/crud/genres';

import { ItemAdd } from '../item/ItemAdd';

const routeConfig: Record<string, ReactNode> = {
  '/': <ItemAdd key="book" choice="book" onCreateAction={addBook} />,
  '/authors': <ItemAdd key="author" choice="author" onCreateAction={addAuthor} />,
  '/genres': <ItemAdd key="genre" choice="genre" onCreateAction={addGenre} />,
};

function Navbar() {
  const pathname = usePathname();
  const ActionComponent = routeConfig[pathname];

  return (
    <nav className="bg-background sticky top-0 flex h-15 w-full items-center justify-between border-b-2 px-3 lg:px-48">
      <div className="flex items-center gap-x-2">
        <AppSidebarTrigger />
        <Link href="/" className="flex cursor-pointer items-center gap-x-2">
          <Image
            src="/react.svg"
            width={24}
            height={24}
            className="animation-duration-[10s] h-6 w-auto animate-spin"
            alt="Logo"
          />
          <h1 className="font-semibold lg:text-lg">Athenaeum</h1>
        </Link>
      </div>

      <div className="flex items-center gap-x-2">{ActionComponent}</div>
    </nav>
  );
}

export { Navbar };
