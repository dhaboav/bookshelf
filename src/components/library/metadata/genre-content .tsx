import { Suspense } from 'react';

import { MetadataFormDialog } from '@/components/library/metadata/metadata-form-dialog';
import { MetadataTable } from '@/components/library/metadata/table/metadata-table';
import { PageHeader } from '@/components/page-header';
import { DataPagination } from '@/components/pagination/data-pagination';
import { PageLimitPagination } from '@/components/pagination/page-limit-pagination';
import { TabsContent } from '@/components/ui/tabs';
import { addGenre, getAllGenres } from '@/db/crud/genre';

export async function GenreContent() {
  const data = await getAllGenres();
  return (
    <TabsContent value="genre" className="pt-5 gap-6 flex flex-col">
      <PageHeader
        title="Genres"
        description="Manage your genre list."
        action={<MetadataFormDialog entityType="genre" onSubmitAction={addGenre} />}
      />
      <MetadataTable entityType="genre" data={data} />
      <Suspense>
        <div className="flex gap-2 mx-auto">
          <PageLimitPagination className="hidden lg:flex" />
          <DataPagination currentPage={1} pageCount={15} isText={false} className="block" />
        </div>
      </Suspense>
    </TabsContent>
  );
}
