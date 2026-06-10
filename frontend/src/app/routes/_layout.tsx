import { authorsQueryOptions } from '@/entities/authors';
import { genresQueryOptions } from '@/entities/genres';
import { SidebarInset, SidebarProvider } from '@/shared/ui';
import { Navbar } from '@/widgets/navbar';
import { SidebarComponent } from '@/widgets/sidebar-component';
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
        <SidebarComponent variant="inset" />
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
