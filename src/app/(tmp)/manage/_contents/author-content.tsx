import { Suspense } from 'react';

import { ItemFormDialog } from '@/components/item/item-form-dialog';
import { PageHeader } from '@/components/page-header';
import { DataPagination } from '@/components/pagination/data-pagination';
import { PageLimitPagination } from '@/components/pagination/page-limit-pagination';
import { TabsContent } from '@/components/ui/tabs';
import { addAuthor, getAllAuthors } from '@/db/crud/author';

import { AuthorTable } from './author-table';

export async function AuthorContent() {
  const data = await getAllAuthors();
  return (
    <TabsContent value="author" className="pt-5 gap-6 flex flex-col">
      <PageHeader
        title="Authors"
        description="Manage your author list."
        action={<ItemFormDialog entityType="author" onSubmitAction={addAuthor} />}
      />
      <AuthorTable data={data} />
      <Suspense>
        <div className="flex gap-2 mx-auto">
          <PageLimitPagination className="hidden lg:flex" />
          <DataPagination currentPage={1} pageCount={15} isText={false} className="block" />
        </div>
      </Suspense>
    </TabsContent>
  );
}
