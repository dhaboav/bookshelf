'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { type Book } from '@/db/validators/book';

export function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`detail/${book.id}`}>
      <Card className="grid group overflow-hidden border transition-colors duration-200 hover:border-foreground/30">
        <Image
          src={book.cover_img || '/cover.jpg'}
          width={1000}
          height={700}
          alt={book.title || 'Book cover'}
          className="col-start-1 row-start-1 h-full w-full object-cover"
        />

        <Badge
          variant="secondary"
          className="uppercase text-tiny col-start-1 row-start-1 m-3 justify-self-start self-start"
        >
          {book.genre?.name ?? 'UNKNOWN'}
        </Badge>

        <CardHeader>
          <CardTitle className="text-lg font-semibold">{book.title}</CardTitle>
          <span>{book.author?.name}</span>
        </CardHeader>
      </Card>
    </Link>
  );
}
