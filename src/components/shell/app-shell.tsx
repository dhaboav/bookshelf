import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="[--sidebar-width:--spacing(72)] [--header-height:--spacing(12)]">
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="px-4 lg:px-6 bg-content md:rounded-tl-4xl min-h-[calc(100svh-var(--header-height)-1rem)]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
