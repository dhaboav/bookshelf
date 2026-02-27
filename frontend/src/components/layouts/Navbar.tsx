import reactLogo from '@/assets/react.svg';
import AddBook from '@/components/books/AddBook';

const Navbar = () => {
    return (
        <nav className="sticky top-0 flex h-15 w-full items-center justify-between border-b-2 bg-white px-3 lg:px-48">
            <div className="flex items-center gap-x-2">
                <img src={reactLogo} className="animation-duration-[10s] animate-spin" alt="Logo" />
                <h1 className="font-semibold lg:text-lg">React Library</h1>
            </div>
            <AddBook />
        </nav>
    );
};

export default Navbar;
