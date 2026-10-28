import { BookCard } from '@/components/book/book-card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { getBooks } from '@/db/crud/book';

export async function MyBookSection() {
  const q = '';
  const { metadata, data } = await getBooks(Number(1), Number(10), q);
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2">
        {data.map((book) => (
          <CarouselItem key={book.id} className="basis-1/3 md:basis-1/4 pl-2 lg:basis-1/5">
            <BookCard book={book} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
