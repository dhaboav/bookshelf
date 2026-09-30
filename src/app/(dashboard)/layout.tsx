import { AppSidebar } from '@/components/nav/AppSidebar';
import { Navbar } from '@/components/nav/Navbar';
import { addAuthor, getAuthors } from '@/db/crud/authors';
import { addBook } from '@/db/crud/books';
import { addGenre, getGenres } from '@/db/crud/genres';
import { SidebarInset, SidebarProvider } from '@/ui/sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [genres, authors] = await Promise.all([getGenres(), getAuthors()]);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar
            addBookAction={addBook}
            addAuthorAction={addAuthor}
            addGenreAction={addGenre}
            genres={genres}
            authors={authors}
          />
          <main className="px-3 lg:px-48">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
