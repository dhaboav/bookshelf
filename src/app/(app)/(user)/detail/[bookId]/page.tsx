import { ArrowLeftIcon, HeartIcon } from 'lucide-react';
import Link from 'next/link';

import { BookCover } from '@/components/book/book-cover';
import { Button, buttonVariants } from '@/components/ui/button';
import { getBookById } from '@/db/crud/book';

import { DescriptionSection } from './description-section';
import { StatusMenuButton } from './status-menu-button';

export default async function BookDetailPage({ params }: { params: Promise<{ bookId: number }> }) {
  const { bookId } = await params;
  const { data } = await getBookById(bookId);
  const details = [
    { label: 'Genre', value: data.genreName },
    { label: 'Pages', value: data.totalPages },
    { label: 'Publication Year', value: data.publishedYear },
    { label: 'ISBN', value: data.isbn },
  ];

  return (
    <main className="mx-auto my-6 w-full max-w-6xl">
      <Link href="/" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
        <ArrowLeftIcon />
        Back
      </Link>

      <div className="mt-6 grid gap-6 md:grid-cols-4 md:gap-x-8">
        {/* cover + actions */}
        <div className="contents md:flex md:flex-col md:gap-6">
          <BookCover image={data.coverImg} className="order-1 md:order-0 mx-auto w-60 md:mx-0 md:w-full" />
          <div className="grid grid-cols-[minmax(0,1fr)_48px] gap-2 order-3 mx-auto w-full max-w-2xs md:order-0">
            <StatusMenuButton totalPages={data.totalPages} />
            <Button variant="outline" size="icon" className="w-12" aria-label="Add to Favorites">
              <HeartIcon />
            </Button>
          </div>
        </div>

        {/* title + description + details */}
        <div className="contents md:flex md:min-w-0 md:flex-col md:gap-6 md:col-span-3">
          <header className="order-2 flex flex-col items-center text-center md:order-0 md:items-start md:text-left">
            <h1 className="text-2xl font-bold leading-tight md:text-3xl">{data.title}</h1>
            <p className="mt-2 text-base text-muted-foreground">{data.authorName}</p>
          </header>

          <div className="order-4 min-w-0 md:order-0">
            {data.description && (
              <section className="mt-6">
                <h2 className="text-xl font-semibold md:text-2xl">Description</h2>
                <DescriptionSection description={data.description} className="mt-3" />
              </section>
            )}

            <section className="mt-6">
              <h2 className="text-xl font-semibold md:text-2xl">Book Details</h2>
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-5">
                {details.map((item) => (
                  <RenderList key={item.label} item={item} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function RenderList({ item }: { item: { label: string; value: string | number | null } }) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-muted-foreground">{item.label}</p>
      <p className="wrap-break-word">{item.value}</p>
    </div>
  );
}
