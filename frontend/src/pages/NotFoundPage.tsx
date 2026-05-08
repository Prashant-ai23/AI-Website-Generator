import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-2">Page not found</h2>
        <p className="text-primary-100 mb-8 max-w-md">
          The page you're looking for doesn't exist. It might have been moved or
          deleted.
        </p>
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
