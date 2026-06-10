import { Link, useLocation } from '@tanstack/react-router';

import { AddAuthor } from '@/features/authors';
import { AddBook } from '@/features/books';
import { AddGenre } from '@/features/genres';
import { SearchBar } from '@/features/search-global';

import reactLogo from '@/assets/react.svg';
import { SidebarTrigger } from '@/shared/ui';

export const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="bg-background sticky top-0 flex h-15 w-full items-center justify-between border-b-2 px-3 lg:px-48">
      <Link to="/" className="flex items-center gap-x-2">
        <img src={reactLogo} className="animation-duration-[10s] h-6 animate-spin" alt="Logo" />
        <h1 className="font-semibold lg:text-lg">React Library</h1>
      </Link>

      <div className="flex items-center gap-x-2">
        <SidebarTrigger />
        <SearchBar />

        {path === '/' && <AddBook />}
        {path === '/author' && <AddAuthor />}
        {path === '/genre' && <AddGenre />}
      </div>
    </nav>
  );
};
