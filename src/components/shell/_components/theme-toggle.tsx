'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Button variant="ghost" size="icon-sm" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      <SunIcon className="size-4 scale-100 transition-all dark:scale-0" />
      <MoonIcon className="absolute size-4 scale-0 transition-all dark:scale-100" />
    </Button>
  );
}
