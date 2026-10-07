import { AppSidebar } from '@/components/nav/app-sidebar';
import { Navbar } from '@/components/nav/navbar';
import { SidebarInset, SidebarProvider } from '@/ui/sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider
        defaultOpen={false}
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <main className="px-4 lg:px-6 bg-content md:rounded-tl-4xl min-h-[calc(100svh-var(--header-height)-1rem)]">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
