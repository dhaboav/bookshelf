import NotFound from '@/components/layouts/NotFound';
import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
    component: () => (
        <>
            <HeadContent />
            <Outlet />
        </>
    ),
    notFoundComponent: () => <NotFound />,
});
