interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  description?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({
  message,
  description,
  icon,
  className = '',
  ...props
}: EmptyStateProps) => {
  return (
    <div
      className={`bg-muted/10 my-8 flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center ${className}`}
      {...props}
    >
      {icon && <div className="text-muted-foreground mb-3">{icon}</div>}

      <h3 className="text-xl font-semibold tracking-tight text-slate-700">{message}</h3>

      {description && <p className="text-muted-foreground mt-1 max-w-xs text-sm">{description}</p>}
    </div>
  );
};
