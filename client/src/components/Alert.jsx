import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`flex items-start justify-between p-4 rounded-xl border animate-fade-in transition-all ${
        isSuccess
          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
          : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
      }`}
    >
      <div className="flex items-start space-x-3">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
        )}
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
