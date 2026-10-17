import { BookCopyIcon, LayoutDashboardIcon, TagsIcon, UsersIcon } from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/books', label: 'Books', icon: BookCopyIcon, role: 'admin' },
  { href: '/genres', label: 'Genres', icon: TagsIcon, role: 'admin' },
  { href: '/authors', label: 'Authors', icon: UsersIcon, role: 'admin' },
  { href: '/', label: 'Dashboard', icon: LayoutDashboardIcon, role: 'user' },
] as const;
