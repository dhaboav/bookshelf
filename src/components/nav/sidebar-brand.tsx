'use client';

import { PanelRightClose, PanelRightIcon, PanelRightOpenIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/ui/button';
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/ui/sidebar';

export function SidebarBrand() {
  const { toggleSidebar, state } = useSidebar();
  const isOpen = state === 'expanded';

  const LogoContent = (
    <>
      <Image
        src="/react.svg"
        width={18}
        height={18}
        alt="Athenaeum Logo"
        className={`w-auto animate-spin h-5 animation-duration-[10s]  ${
          !isOpen && 'group-hover/side-button:opacity-0'
        }`}
      />
      {isOpen && <span className="group-data-[collapsible=icon]:hidden">Athenaeum</span>}
      {!isOpen && (
        <PanelRightClose className="absolute size-4 opacity-0 group-hover/side-button:opacity-100" />
      )}
    </>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2 justify-between">
        {isOpen ? (
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
          >
            {LogoContent}
          </Link>
        ) : (
          <Button
            onClick={toggleSidebar}
            size="icon"
            variant="outline"
            className="group/side-button relative flex items-center justify-center text-gray-300"
            aria-label="Toggle Sidebar"
          >
            {LogoContent}
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="grid group/nav size-4 text-gray-300"
        >
          <XIcon className="col-start-1 row-start-1 md:hidden" />
          <PanelRightIcon className="hidden col-start-1 row-start-1 md:block group-hover/nav:opacity-0" />
          <PanelRightOpenIcon className="hidden col-start-1 row-start-1 opacity-0 md:block group-hover/nav:opacity-100" />
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
