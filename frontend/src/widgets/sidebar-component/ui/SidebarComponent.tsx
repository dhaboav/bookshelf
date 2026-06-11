import { BarcodeScanner } from '@/features/barcode-scanner';
import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/ui';
import { Link, useNavigate } from '@tanstack/react-router';
import { BookOpen, ScanLine, Tag, Users, X } from 'lucide-react';

const MENU_ITEMS = [
  { num: '01', label: 'Books', icon: BookOpen, to: '/' },
  { num: '02', label: 'Authors', icon: Users, to: '/author' },
  { num: '03', label: 'Genres', icon: Tag, to: '/genre' },
] as const;

export const SidebarComponent = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();

  const handleScanSuccess = (scannedCode: string) => {
    navigate({
      to: '.',
      search: (prev: any) => ({ ...prev, q: scannedCode }),
      replace: true,
    });
  };

  return (
    <Sidebar collapsible="offcanvas" {...props} className="sticky top-0 h-screen border-r">
      <SidebarHeader className="mb-4 flex flex-row justify-between p-6">
        <div>
          <h1 className="font-display text-gold text-3xl tracking-tight italic">Athenaeum</h1>
          <p className="text-foreground/30 mt-1 font-mono text-[10px] tracking-[0.25em] uppercase">
            Private Collection
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(false)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-800 md:hidden"
          aria-label="Close Menu"
        >
          <X className="text-foreground size-4" />
        </Button>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarMenu className="flex-1 space-y-2 px-6">
          {MENU_ITEMS.map(({ num, label, icon: Icon, to }) => (
            <SidebarMenuItem key={label}>
              <SidebarMenuButton asChild>
                <Link
                  to={to}
                  className="text-foreground/60 flex items-center gap-x-2 rounded-lg border border-transparent transition-all"
                  activeProps={{
                    className:
                      'bg-gold/10 !border-gold/20 text-gold pointer-events-none font-semibold',
                  }}
                >
                  <span className="font-mono text-[10px] opacity-50">{num}</span>
                  <Icon />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="text-muted-foreground flex w-full flex-col gap-y-5 px-6 text-center text-xs">
        <BarcodeScanner
          onScanSuccess={handleScanSuccess}
          actionButton={
            <Button className="bg-gold/10 border-gold/20 text-gold hover:bg-gold/20 mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-all">
              <ScanLine className="size-4" strokeWidth={1.5} />
              <span className="text-xs font-medium tracking-[0.2em] uppercase">Scan Library</span>
            </Button>
          }
        />

        <div className="flex flex-col">
          <span>Bookshelf v1.2</span>
          <span>
            Created with ❤️ by{' '}
            <a
              href="https://github.com/dhaboav"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-red-500 hover:underline"
            >
              dhaboav
            </a>
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
