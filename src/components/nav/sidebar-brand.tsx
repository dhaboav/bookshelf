'use client';

import { PanelRightClose, PanelRightIcon, PanelRightOpenIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/ui/button';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/ui/sidebar';

export function SidebarBrand() {
  const { toggleSidebar, state } = useSidebar();
  const isOpen = state === 'expanded';

  const LogoContent = (
    <>
      <span className="grid">
        <Image
          src="/react.svg"
          width={18}
          height={18}
          alt="Brand's logo"
          className="w-auto animate-spin h-5 animation-duration-[10s] group-data-[state=collapsed]:group-hover/side-button:opacity-0 col-start-1 row-start-1 brightness-0 invert"
        />
        <PanelRightClose className="size-5 col-start-1 row-start-1 opacity-0 group-hover/side-button:opacity-100" />
      </span>
      <span className="group-data-[state=collapsed]:hidden">Athenaeum</span>
    </>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2 justify-between">
        {isOpen ? (
          <SidebarMenuButton
            render={<Link href="/" />}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
          >
            {LogoContent}
          </SidebarMenuButton>
        ) : (
          <Button
            onClick={toggleSidebar}
            size="icon"
            variant="outline"
            className="group/side-button relative flex items-center justify-center bg-primary-button!"
            aria-label="Toggle Sidebar"
          >
            {LogoContent}
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="grid group/nav size-4 group-data-[state=collapsed]:hidden"
        >
          <XIcon className="col-start-1 row-start-1 md:hidden" />
          <PanelRightIcon className="col-start-1 row-start-1 group-hover/nav:opacity-0 group-data-[state=expanded]:block hidden" />
          <PanelRightOpenIcon className="col-start-1 row-start-1 opacity-0 group-hover/nav:opacity-100 group-data-[state=expanded]:block hidden" />
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
