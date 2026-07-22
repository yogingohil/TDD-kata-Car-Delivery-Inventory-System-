import { FC } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export const NotFoundPage: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md text-center space-y-4">
        <span className="text-6xl font-extrabold text-amber-500">404</span>
        <h2 className="text-xl font-bold text-slate-100">Page Not Found</h2>
        <p className="text-sm text-slate-400">
          The architectural route you are attempting to access does not exist.
        </p>
        <Link to="/" className="inline-block pt-2">
          <Button variant="primary">Return Home</Button>
        </Link>
      </Card>
    </div>
  );
};
