import { BarcodeScanner } from '@/features/barcode-scanner';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { LibraryBig, Tags, Users } from 'lucide-react';

const MENU_ITEMS = [
  { to: '/', label: 'Books', icon: LibraryBig },
  { to: '/author', label: 'Authors', icon: Users },
  { to: '/genre', label: 'Genres', icon: Tags },
] as const;

export const SidebarComponent = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isBookPage = pathname === '/';

  const handleScanSuccess = (scannedCode: string) => {
    navigate({
      to: '.',
      search: (prev: any) => ({ ...prev, q: scannedCode }),
      replace: true,
    });
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b px-4 py-3">
        <span className="text-sm font-semibold">Menu</span>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
        <SidebarMenu>
          {MENU_ITEMS.map(({ to, label, icon: Icon }) => (
            <SidebarMenuItem key={to}>
              <SidebarMenuButton asChild isActive={pathname === to}>
                <Link to={to} className="flex items-center gap-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {isBookPage && (
            <>
              <div className="my-2 border-t border-dashed" />
              <SidebarMenuItem className="px-2">
                <BarcodeScanner onScanSuccess={handleScanSuccess} />
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="text-muted-foreground flex flex-col gap-y-0.5 p-4 text-center text-xs">
        <span>Bookshelf v1.2</span>
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
