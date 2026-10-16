interface NoResultProps {
  query: string;
  placeholder: string;
}

function NoResult({ query, placeholder }: NoResultProps) {
  return (
    <div className="border-border text-center rounded-xl border-4 border-dashed p-8 font-mono">
      <p className="text-sm text-slate-400">No {placeholder} found for</p>
      <span className="text-foreground block w-full truncate font-bold">
        "{query.length > 15 ? `${query.slice(0, 15)}...` : query}"
      </span>
    </div>
  );
}

export { NoResult };
