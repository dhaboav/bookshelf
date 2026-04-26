import { genresQueryOptions } from '@/api/genre';
import Navbar from '@/components/layouts/Navbar';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';

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
