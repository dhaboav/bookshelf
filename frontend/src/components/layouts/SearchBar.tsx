import { ButtonGroup, Input } from '@/shared/ui';
import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

const SearchBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const search: any = useSearch({ strict: false });
  const [value, setValue] = useState(search.q || '');

  const inputRef = useRef<HTMLInputElement>(null);

  const getPlaceholder = () => {
    const path = location.pathname;
    if (path.includes('/author')) return 'Search Author...';
    if (path.includes('/genre')) return 'Search Genre...';
    return 'Search Book...';
  };
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
        to: '.',
        search: (prev: any) => ({
          ...prev,
          q: value || undefined,
        }),
        replace: true,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, navigate]);

  useEffect(() => {
    if (search.q !== undefined && search.q !== value) {
      setValue(search.q);
    } else if (search.q === undefined && value !== '') {
      // Optional: Clears the input field if the query string is wiped out
      setValue('');
    }
  }, [search.q]);

  return (
    <ButtonGroup>
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          className="w-24 lg:w-full"
          placeholder={getPlaceholder()}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <kbd className="bg-muted pointer-events-none absolute right-2 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none lg:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </ButtonGroup>
  );
};

export default SearchBar;
