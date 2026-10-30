import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { NoResult } from '@/components/no-result';
import { buttonVariants } from '@/components/ui/button';
import { getBooks } from '@/db/crud/book';

import { LatestUpdateSection } from './latest-update-section';
import { MyBookSection } from './my-book-section';

interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
  }>;
}

export const instant = false;

export default async function Homepage({ searchParams }: Props) {
  const { page = '1', limit = '12', q = '' } = await searchParams;

  const { metadata, data } = await getBooks(Number(page), Number(limit), q);

  if (data.length === 0) {
    return (
      <div className="py-12">
        <NoResult query={q} placeholder="book" />
      </div>
    );
  }

  return (
    <div className="py-6 ">
      <div>
        <SectionHeaderRender label="My Books" href="" />
        <MyBookSection />
      </div>
      <div className="mt-4">
        <SectionHeaderRender label="Recently Added" href="" />
        <LatestUpdateSection />
      </div>
    </div>
  );
}

function SectionHeaderRender({ label, href }: { label: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p>{label}</p>
      <Link href={href} className={buttonVariants({ variant: 'secondary', size: 'icon-sm' })}>
        <ChevronRightIcon />
      </Link>
    </div>
  );
}
