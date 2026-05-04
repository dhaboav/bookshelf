import AddAuthor from '@/components/authors/AddAuthor';
import AddBook from '@/components/books/AddBook';
import AddGenre from '@/components/genres/AddGenre';
import SearchBar from '@/components/layouts/SearchBar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLocation } from '@tanstack/react-router';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="bg-background sticky top-0 flex h-15 w-full items-center justify-between border-b-2 px-3 lg:px-48">
      <SidebarTrigger />

      <div className="flex gap-x-2">
        <SearchBar />
        {path === '/' && <AddBook />}
        {path === '/author' && <AddAuthor />}
        {path === '/genre' && <AddGenre />}
      </div>
    </nav>
  );
};

export default Navbar;
