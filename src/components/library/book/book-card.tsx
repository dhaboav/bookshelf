'use client';

import Link from 'next/link';

import { type Book } from '@/db/validators/book';

export function BookCard({ book }: { book: Book }) {
  return (
    <div className="rounded-md overflow-hidden  flex flex-col h-full hover:border-indigo-500/50 transition-all group">
      <Link href={`detail/${book.id}`} className="block">
        <div className="relative aspect-3/4 w-full bg-gray-800 overflow-hidden">
          <img
            src={book.cover_img || 'https://via.placeholder.com/300x450?text=No+Cover'}
            alt={book.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-[9px] font-semibold px-1.5 py-0.5 rounded text-indigo-300 border border-indigo-500/30">
            {book.genre?.name}
          </span>
        </div>
      </Link>

      <h2 className="py-3 px-2 font-semibold text-xs text-gray-100 line-clamp-2 group-hover:text-primary transition-colors">
        {book.title}
      </h2>
    </div>
  );
}
