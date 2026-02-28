const ErrorComponent = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-8xl font-bold tracking-tight text-red-600">404</h1>
                    <p className="mb-4 text-4xl font-bold tracking-tight text-white">Error.</p>
                    <p className="text-minor mb-4 text-lg font-light text-white">
                        Something went wrong. Please try again.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorComponent;
