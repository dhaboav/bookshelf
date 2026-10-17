import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';

import { MenuGroup } from './_components/menu-group-item';
import { SidebarBrand } from './_components/sidebar-brand';
import { NAV_ITEMS } from './nav';

const userItems = NAV_ITEMS.filter((item) => item.role === 'user');
const adminItems = NAV_ITEMS.filter((item) => item.role === 'admin');

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="md:pt-4">
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <MenuGroup title="Menu" items={userItems} />
        <MenuGroup title="Admin" items={adminItems} />
      </SidebarContent>

      <SidebarFooter className="text-muted-foreground flex w-full flex-col gap-y-2 px-6 py-4 text-center text-xs group-data-[collapsible=icon]:hidden">
        <div className="flex flex-col">
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
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
