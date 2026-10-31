import { MetadataFormDialog } from '@/components/library/metadata/metadata-form-dialog';
import { MetadataTable } from '@/components/library/metadata/table/metadata-table';
import { PageHeader } from '@/components/page-header';
import { addAuthor, getAuthors } from '@/db/crud/author';

export async function AuthorContent() {
  const authors = await getAuthors();
  return (
    <>
      <PageHeader
        title="Authors"
        description="Manage your author list."
        action={<MetadataFormDialog entityType="authors" onSubmitAction={addAuthor} />}
      />
      <MetadataTable entityType="authors" initialData={authors} />
    </>
  );
}
