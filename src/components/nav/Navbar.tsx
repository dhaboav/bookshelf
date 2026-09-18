'use client';
import { addAuthor } from '@/actions/authors';
import { addGenre } from '@/actions/genres';
import { ItemCreate } from '@/components/item/ItemCreate';
import { AppSidebarBtn } from '@/components/nav/AppSidebarBtn';
import { SearchBar } from '@/components/nav/SearchBar';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const routeConfig: Record<string, { label: string; onCreate: (name: string) => Promise<void> }> = {
  '/': { label: 'Book', onCreate: addAuthor },
  '/authors': { label: 'Author', onCreate: addAuthor },
  '/genres': { label: 'Genre', onCreate: addGenre },
};

export const Navbar = () => {
  const pathname = usePathname();
  const currentConfig = routeConfig[pathname];
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

      <div className="flex items-center gap-x-2">
        {currentConfig && (
          <>
            <SearchBar placeholder={currentConfig?.label?.toLowerCase() ?? ''} />
            <ItemCreate label={currentConfig?.label} onCreate={currentConfig?.onCreate} />
          </>
        )}
      </div>
    </nav>
  );
};
