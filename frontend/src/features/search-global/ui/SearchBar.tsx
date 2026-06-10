import { ButtonGroup, Input } from '@/shared/ui';
import { useSearchBar } from '../hooks/useSearchbar';

export const SearchBar = () => {
  const { value, setValue, inputRef, placeholder } = useSearchBar();

  return (
    <ButtonGroup>
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          className="w-24 lg:w-full"
          placeholder={placeholder}
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
