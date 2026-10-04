'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AppSidebarTrigger } from '@/components/nav/AppSidebar';

import { ItemAdd } from '../item/ItemAdd';

interface NavbarProps {
  addBookAction: any;
  addAuthorAction: any;
  addGenreAction: any;
  genres: any[];
  authors: any[];
}

export function Navbar({ addBookAction, addAuthorAction, addGenreAction, genres, authors }: NavbarProps) {
  const pathname = usePathname();

  const routeConfig: Record<string, React.ReactNode> = {
    '/': (
      <ItemAdd
        key="book"
        choice="book"
        onCreateAction={addBookAction}
        authorData={authors}
        genreData={genres}
      />
    ),
    '/authors': <ItemAdd key="author" choice="author" onCreateAction={addAuthorAction} />,
    '/genres': <ItemAdd key="genre" choice="genre" onCreateAction={addGenreAction} />,
  };

  const ActionComponent = routeConfig[pathname];

  return (
    <nav className="bg-background sticky top-0 flex h-15 w-full items-center justify-between z-999 border-b-2 px-3 lg:px-48">
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

      <div className="flex items-center gap-x-2">{ActionComponent}</div>
    </nav>
  );
}
