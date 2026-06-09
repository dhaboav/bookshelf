import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui';

import { Scanner } from '@/components/layouts/Scanner';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { LibraryBig, Tags, Users } from 'lucide-react';

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const isBookPage = path === '/';

  const handleScanSuccess = (scannedCode: string) => {
    // Inject barcode parameter into search bar
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        q: scannedCode,
      }),
      replace: true,
    });
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b px-4 py-3">
        <span>Menu</span>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={path === '/'}>
              <Link to="/" className="flex items-center gap-x-2">
                <LibraryBig className="h-4 w-4" />
                <span>Books</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={path === '/author'}>
              <Link to="/author" className="flex items-center gap-x-2">
                <Users />
                <span>Authors</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={path === '/genre'}>
              <Link to="/genre" className="flex items-center gap-x-2">
                <Tags />
                <span>Genres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isBookPage && <div className="my-2 border-t border-dashed" />}
          {isBookPage && (
            <SidebarMenuItem className="px-2">
              <Scanner onScanSuccess={handleScanSuccess} />
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="text-muted-foreground p-4 text-center text-xs">
        <span>Bookshelf v1.1</span>
        <span>
          Created with ❤️ by{' '}
          <a
            href="https://github.com/dhaboav"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-red-500 hover:underline"
          >
            dhaboav
          </a>
        </span>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
