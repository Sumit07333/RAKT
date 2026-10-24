import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Unable to Load Records',
  message = 'An unexpected error occurred while fetching information.',
  onRetry
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-rose-50/50 rounded-xl border border-rose-200 p-8">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-[#C41315] mb-3">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-rose-950">{title}</h3>
      <p className="mt-1 text-sm text-rose-800 max-w-md">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
            Retry Request
          </Button>
        </div>
      )}
    </div>
  );
}
