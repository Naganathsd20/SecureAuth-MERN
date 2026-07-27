import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-white">404</h1>
          <h2 className="text-2xl font-bold text-slate-200">Page Not Found</h2>
          <p className="text-slate-400 text-sm">
            The route you are trying to access does not exist or has been restricted.
          </p>
        </div>
        <div className="flex items-center justify-center space-x-4 pt-4">
          <Link
            to="/"
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
