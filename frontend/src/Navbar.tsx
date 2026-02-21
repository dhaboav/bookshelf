import Button from './ui/Button';

function Navbar() {
    return (
        <nav className="flex h-15 items-center justify-between border-b px-16">
            <div className="flex items-center gap-x-2">
                <img src="src\assets\react.svg" className="animate-spin [animation-duration:10s]" alt='Logo'/>
                <h1 className="text-lg font-semibold">React Library</h1>
            </div>
            <Button content={'+ Add Book'} />
        </nav>
    );
}

export default Navbar;
