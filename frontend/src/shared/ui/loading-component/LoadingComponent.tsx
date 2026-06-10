export const LoadingComponent = () => {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      <p className="animate-pulse text-gray-500">Loading your library...</p>
    </div>
  );
};
