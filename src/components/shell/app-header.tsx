'use client';

import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

import { ThemeToggle } from './_components/theme-toggle';
import { NAV_ITEMS } from './nav';

export function AppHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const current = NAV_ITEMS.find((item) => pathname.startsWith(item.href));

  return (
    <header className="h-(--header-height) flex px-4 lg:px-6 items-center">
      <Button onClick={toggleSidebar} variant="ghost" size="icon" className="md:hidden">
        <MenuIcon />
      </Button>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-sm text-muted-foreground max-sm:hidden">Athenaeum /</span>
        <h1 className="truncate text-sm font-medium">{current?.label ?? 'Athenaeum'}</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
