'use client';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';

export const AppSidebarBtn = () => {
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
      <Menu className="text-foreground size-4" />
    </Button>
  );
};
