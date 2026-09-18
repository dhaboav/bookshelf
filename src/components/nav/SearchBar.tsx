import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';

interface Props {
  placeholder: string;
}

export const SearchBar = ({ placeholder }: Props) => {
  const handleSearch = (term: string) => {
    console.log(term);
  };
  return (
    <ButtonGroup>
      <div className="relative flex items-center">
        <Input
          className="w-24 lg:w-full"
          placeholder={`search ${placeholder}...`}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        <kbd className="bg-muted pointer-events-none absolute right-2 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none lg:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </ButtonGroup>
  );
};
