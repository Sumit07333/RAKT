import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading blood availability records...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative">
        <Loader2 className="w-10 h-10 text-[#C41315] animate-spin" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-medium text-[#273741]">{message}</p>
      <p className="text-xs text-slate-500 mt-1">Retrieving verified timestamps...</p>
    </div>
  );
}
