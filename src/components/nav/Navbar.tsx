'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AddAuthor } from '@/components/authors/AddAuthor';
import { AddBook } from '@/components/book/AddBook';
import { AddGenre } from '@/components/genres/AddGenre';
import { AppSidebarBtn } from '@/components/nav/AppSidebarBtn';

const routeConfig: Record<string, React.ReactNode> = {
  '/': <AddBook />,
  '/authors': <AddAuthor />,
  '/genres': <AddGenre />,
};

export const Navbar = () => {
  const pathname = usePathname();
  const ActionComponent = routeConfig[pathname];

  return (
    <nav className="bg-background sticky top-0 flex h-15 w-full items-center justify-between border-b-2 px-3 lg:px-48">
      <div className="flex items-center gap-x-2">
        <AppSidebarBtn />
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

      <div className="flex items-center gap-x-2">{ActionComponent || null}</div>
    </nav>
  );
};
