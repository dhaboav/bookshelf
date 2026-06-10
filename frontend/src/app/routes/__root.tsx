import { Button, ErrorComponent, NotFound } from '@/shared/ui';
import { createRootRoute, HeadContent, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <>
      <HeadContent />
      <Outlet />
    </>
  ),
  errorComponent: () => <ErrorComponent />,
  notFoundComponent: () => (
    <NotFound
      actionButton={
        <Link to="/">
          <Button variant="secondary" className="bg-blue-600">
            Back to Home
          </Button>
        </Link>
      }
    />
  ),
});
