import { LayoutDashboardIcon, LibraryIcon } from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/library', label: 'Library', icon: LibraryIcon, role: 'workspace' },
  { href: '/', label: 'Dashboard', icon: LayoutDashboardIcon, role: 'workspace' },
] as const;
