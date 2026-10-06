import { AppSidebar } from '@/components/nav/app-sidebar';
import { Navbar } from '@/components/nav/navbar';
import { SidebarInset, SidebarProvider } from '@/ui/sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <main className="px-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
