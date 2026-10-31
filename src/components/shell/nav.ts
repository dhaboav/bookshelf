import { LayoutDashboardIcon, LibraryIcon } from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboardIcon, role: 'workspace' },
  { href: '/library', label: 'Library', icon: LibraryIcon, role: 'workspace' },
] as const;
