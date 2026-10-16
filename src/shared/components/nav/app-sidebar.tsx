import { BookCopyIcon, LayoutDashboardIcon, TagsIcon, UsersIcon } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/ui/sidebar';

import { NavAdmin } from './nav-admin';
import { NavUser } from './nav-user';
import { SidebarBrand } from './sidebar-brand';

const data = {
  adminSide: [
    {
      name: 'Authors',
      url: '/authors',
      icon: UsersIcon,
    },
    {
      name: 'Genres',
      url: '/genres',
      icon: TagsIcon,
    },
    {
      name: 'Books',
      url: '/books',
      icon: BookCopyIcon,
    },
  ],
  userSide: [
    {
      name: 'Dashboard',
      url: '/',
      icon: LayoutDashboardIcon,
    },
  ],
};

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="md:pt-4">
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <NavUser items={data.userSide} />
        <NavAdmin items={data.adminSide} />
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

export { AppSidebar };
