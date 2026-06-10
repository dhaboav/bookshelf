import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';

export const useSearchBar = (debounceDelay = 300) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const search: any = useSearch({ strict: false });
  const [value, setValue] = useState(search.q || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Dinamis Placeholder berdasarkan Rute
  const getPlaceholder = () => {
    if (pathname.includes('/author')) return 'Search Author...';
    if (pathname.includes('/genre')) return 'Search Genre...';
    return 'Search Book...';
  };

  // 2. Logika Shortcut Ctrl + K
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

  // 3. Logika Debounce Sinkronisasi ke URL
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate({
        to: '.',
        search: (prev: any) => ({ ...prev, q: value || undefined }),
        replace: true,
      });
    }, debounceDelay);

    return () => clearTimeout(timeout);
  }, [value, navigate, debounceDelay]);

  // 4. Sinkronisasi URL jika berubah dari luar (misal: hasil scan barcode)
  useEffect(() => {
    if (search.q !== undefined && search.q !== value) {
      setValue(search.q);
    } else if (search.q === undefined && value !== '') {
      setValue('');
    }
  }, [search.q]);

  return {
    value,
    setValue,
    inputRef,
    placeholder: getPlaceholder(),
  };
};
