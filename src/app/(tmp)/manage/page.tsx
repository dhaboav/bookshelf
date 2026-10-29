import { TagsIcon, UsersIcon } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AuthorContent } from './_contents/author-content';
import { GenreContent } from './_contents/genre-content ';

export default function ManagePage() {
  return (
    <main className="my-6">
      <Tabs defaultValue="author">
        <TabsList variant="line">
          <TabsTrigger value="author">
            <UsersIcon />
            Author
          </TabsTrigger>
          <TabsTrigger value="genre">
            <TagsIcon />
            Genre
          </TabsTrigger>
        </TabsList>
        <AuthorContent />
        <GenreContent />
      </Tabs>
    </main>
  );
}
