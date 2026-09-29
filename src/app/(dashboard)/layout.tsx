import { AppSidebar } from '@/components/nav/AppSidebar';
import { Navbar } from '@/components/nav/Navbar';
import { SidebarInset, SidebarProvider } from '@/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <main className="px-3 lg:px-48">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
