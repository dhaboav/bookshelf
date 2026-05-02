import reactLogo from '@/assets/react.svg';
import AddAuthor from '@/components/authors/AddAuthor';
import AddBook from '@/components/books/AddBook';
import SearchBar from '@/components/layouts/SearchBar';
import { Link, useLocation } from '@tanstack/react-router';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="bg-background sticky top-0 flex h-15 w-full items-center justify-between border-b-2 px-3 lg:px-48">
      <Link to="/" className="flex items-center gap-x-2">
        <img src={reactLogo} className="animation-duration-[10s] animate-spin" alt="Logo" />
        <h1 className="font-semibold lg:text-lg">React Library</h1>
      </Link>

      <div className="flex gap-x-2">
        <SearchBar />
        {path === '/' && <AddBook />}
        {path === '/author' && <AddAuthor />}
      </div>
    </nav>
  );
};

export default Navbar;
