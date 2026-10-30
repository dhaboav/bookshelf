import { BookCopyIcon, TagsIcon, UsersIcon } from 'lucide-react';
import { Metadata } from 'next';

import { BookContent } from '@/components/library/book/book-content';
import { AuthorContent } from '@/components/library/metadata/author-content';
import { GenreContent } from '@/components/library/metadata/genre-content ';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = { title: 'Library · ReadQuest' };

export default function LibraryPage() {
  return (
    <main className="my-6">
      <Tabs defaultValue="book">
        <TabsList variant="line">
          <TabsTrigger value="book">
            <BookCopyIcon />
            Book
          </TabsTrigger>
          <TabsTrigger value="author">
            <UsersIcon />
            Author
          </TabsTrigger>
          <TabsTrigger value="genre">
            <TagsIcon />
            Genre
          </TabsTrigger>
        </TabsList>
        <BookContent />
        <AuthorContent />
        <GenreContent />
      </Tabs>
    </main>
  );
}
