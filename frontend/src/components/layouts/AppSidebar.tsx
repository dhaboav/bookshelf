import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Link } from '@tanstack/react-router';
import { LibraryBig, Users } from 'lucide-react';

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <span>Menu</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/author" className="flex items-center gap-x-2">
                <Users />
                <span>Authors</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/genre" className="flex items-center gap-x-2">
                <LibraryBig />
                <span>Genres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="text-muted-foreground p-4 text-center text-xs">
        <span>Bookshelf v1.1</span>
        <span>
          Created with ❤️ by{' '}
          <a href="https://github.com/dhaboav" className="text-red-600">
            dhaboav
          </a>
        </span>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
