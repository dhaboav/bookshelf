import { BookOpenIcon, TagIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/ui/sidebar';

import { SidebarBrand } from './sidebar-brand';

const MENU_ITEMS = [
  { label: 'Books', icon: BookOpenIcon, to: '/' },
  { label: 'Authors', icon: UsersIcon, to: '/authors' },
  { label: 'Genres', icon: TagIcon, to: '/genres' },
] as const;

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="md:pt-4">
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent className="px-1">
        <SidebarMenu className="md:gap-6 text-secondary-text pt-12">
          {MENU_ITEMS.map(({ label, icon: Icon, to }) => (
            <SidebarMenuItem key={label}>
              <SidebarMenuButton
                tooltip={label}
                render={
                  <Link href={to}>
                    <Icon className="size-5!" />
                    <span className="group-data-[collapsible=icon]:hidden">{label}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
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
