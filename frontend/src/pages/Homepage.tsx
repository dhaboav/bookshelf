import reactLogo from '@/assets/react.svg';
import AddBook from '@/components/AddBook';

export default function Homepage() {
    return (
        <>
            <nav className="flex h-15 items-center justify-between border-b px-16">
                <div className="flex items-center gap-x-2">
                    <img
                        src={reactLogo}
                        className="animation-duration-[10s] animate-spin"
                        alt="Logo"
                    />
                    <h1 className="text-lg font-semibold">React Library</h1>
                </div>
                <AddBook />
            </nav>
        </>
    );
}
