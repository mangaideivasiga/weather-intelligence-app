import React from 'react';
import { AlertCircle, RefreshCw, Search, MapPin } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onResetToDefault?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onResetToDefault,
}) => {
  return (
    <div className="bg-slate-900/90 border border-rose-500/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl max-w-xl mx-auto my-8">
      <div className="w-14 h-14 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
        <AlertCircle className="w-7 h-7 animate-bounce" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-slate-100">Location / Weather Not Found</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">{message}</p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-sky-500/20"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}

        {onResetToDefault && (
          <button
            type="button"
            onClick={onResetToDefault}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition"
          >
            <MapPin className="w-4 h-4 text-sky-400" /> Default City (Tokyo)
          </button>
        )}
      </div>
    </div>
  );
};
