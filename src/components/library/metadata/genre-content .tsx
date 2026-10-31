import { MetadataFormDialog } from '@/components/library/metadata/metadata-form-dialog';
import { MetadataTable } from '@/components/library/metadata/table/metadata-table';
import { PageHeader } from '@/components/page-header';
import { addGenre, getGenres } from '@/db/crud/genre';

export async function GenreContent() {
  const genres = await getGenres();
  return (
    <>
      <PageHeader
        title="Genres"
        description="Manage your genre list."
        action={<MetadataFormDialog entityType="genres" onSubmitAction={addGenre} />}
      />
      <MetadataTable entityType="genres" initialData={genres} />
    </>
  );
}
