import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

const NotFound = () => {
    return (
        <div className="bg-primary flex h-screen items-center justify-center">
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="text-secondary mb-4 text-8xl font-bold tracking-tight">404</h1>
                    <p className="mb-4 text-4xl font-bold tracking-tight text-white">
                        Page not found.
                    </p>
                    <p className="text-minor mb-4 text-lg font-light text-white">
                        Oops! Page not found. We can't seem to find the page you're looking for. Go
                        back to home.
                    </p>
                    <Link to={'/'}>
                        <Button variant="secondary">Back to Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
