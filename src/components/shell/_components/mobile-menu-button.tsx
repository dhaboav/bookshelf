'use client';

import { MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

export function MobileMenuButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <Button onClick={toggleSidebar} variant="ghost" size="icon" className="md:hidden">
      <MenuIcon />
    </Button>
  );
}
