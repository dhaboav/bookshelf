import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface NavAdminProps {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}

function NavAdmin({ items }: NavAdminProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              tooltip={item.name}
              render={
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export { NavAdmin };
