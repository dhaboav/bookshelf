import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

const SearchBar = () => {
  const navigate = useNavigate();
  const search: any = useSearch({ strict: false });
  const [value, setValue] = useState(search.q || '');

  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl + K Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search Debounce Logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate({
        to: '/',
        search: (prev: any) => ({
          ...prev,
          q: value || undefined,
        }),
        replace: true,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, navigate]);

  return (
    <ButtonGroup>
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          className="w-24 lg:w-full"
          placeholder="Search book..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        {/* Visual hint for the user (only on large screens) */}
        <kbd className="bg-muted pointer-events-none absolute right-2 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none lg:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </ButtonGroup>
  );
};

export default SearchBar;
