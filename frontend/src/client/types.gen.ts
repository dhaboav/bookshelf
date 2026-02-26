export type BookPublic = {
    id: number;
    title: string;
    author: string;
    genre: string;
    total_pages: number;
    published_year: number;
    description?: string | null;
};
