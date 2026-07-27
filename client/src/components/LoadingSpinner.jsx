import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = true, label = 'Loading session...' }) => {
  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <Loader2 className="w-6 h-6 text-indigo-400 absolute top-3 left-3 animate-pulse" />
        </div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">{label}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 justify-center py-2">
      <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
      <span className="text-slate-300 text-sm font-medium">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
