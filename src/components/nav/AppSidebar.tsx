'use client';

import { BookOpenIcon, MenuIcon, TagIcon, UsersIcon, XIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/ui/sidebar';

const MENU_ITEMS = [
  { num: '01', label: 'Books', icon: BookOpenIcon, to: '/' },
  { num: '02', label: 'Authors', icon: UsersIcon, to: '/authors' },
  { num: '03', label: 'Genres', icon: TagIcon, to: '/genres' },
] as const;

function AppSidebarTrigger() {
  const { openMobile, setOpenMobile } = useSidebar();
  if (openMobile) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpenMobile(true)}
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-zinc-800 md:hidden"
      aria-label="Open Menu"
    >
      <MenuIcon className="text-foreground size-4" />
    </Button>
  );
}

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="offcanvas" {...props} className="sticky top-0 h-screen border-r">
      <SidebarHeader className="mb-4 flex flex-row justify-between p-6">
        <div>
          <h1 className="font-display text-gold text-3xl tracking-tight italic">Athenaeum</h1>
          <p className="text-foreground/30 mt-1 font-mono text-tiny tracking-[0.25em] uppercase">
            Private Collection
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(false)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-800 md:hidden"
          aria-label="Close Menu"
        >
          <XIcon className="text-foreground size-4" />
        </Button>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarMenu className="flex-1 space-y-2 px-6">
          {MENU_ITEMS.map(({ num, label, icon: Icon, to }) => (
            <SidebarMenuItem key={label}>
              <SidebarMenuButton
                render={
                  <Link
                    href={to}
                    className="text-foreground/60 flex items-center gap-x-2 rounded-lg border border-transparent transition-all"
                  >
                    <span className="font-mono text-tiny opacity-50">{num}</span>
                    <Icon />
                    <span className="text-sm font-medium">{label}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="text-muted-foreground flex w-full flex-col gap-y-5 px-6 text-center text-xs">
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

export { AppSidebar, AppSidebarTrigger };
