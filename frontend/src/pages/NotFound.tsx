import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="text-8xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-white">
        Page Not Found
      </h1>
      <p className="text-slate-400 max-w-md text-sm">
        The inventory route or resource you are searching for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="px-6 py-3 font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
      >
        Return to Home Page
      </Link>
    </div>
  );
};
