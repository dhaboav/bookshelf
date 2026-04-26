import { type GenrePublic } from '@/client/types.gen';
import Navbar from '@/components/layouts/Navbar';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const genresQueryOptions = {
  queryKey: ['genres'],
  queryFn: async (): Promise<GenrePublic[]> => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/genre/`);

    if (!response.ok) {
      throw new Error('Failed to fetch genres from the server');
    }

    return response.json();
  },
  staleTime: 1000 * 60 * 60,
};

export const Route = createFileRoute('/_layout')({
  component: Layout,
});

export default function Layout() {
  useQuery(genresQueryOptions);

  return (
    <>
      <Navbar />
      <main className="px-3 lg:px-48">
        <Outlet />
      </main>
    </>
  );
}
