import { authorsQueryOptions } from '@/api/author';
import { genresQueryOptions } from '@/api/genre';
import AppSidebar from '@/components/layouts/AppSidebar';
import Navbar from '@/components/layouts/Navbar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
  component: Layout,
});

function Layout() {
  useQuery(genresQueryOptions);
  useQuery(authorsQueryOptions);

  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <Navbar />
          <main className="px-3 lg:px-48">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
