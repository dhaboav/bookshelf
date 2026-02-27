import Navbar from '@/components/layouts/Navbar';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
    component: Layout,
});

export default function Layout() {
    return (
        <>
            <Navbar />
            <main className="lg:px-48">
                <Outlet />
            </main>
        </>
    );
}
