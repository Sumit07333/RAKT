import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({
  id,
  value,
  onChange,
  options = [],
  disabled = false,
  error = null,
  placeholder = 'Select option',
  className = '',
  ...props
}) {
  return (
    <div className="relative rounded-lg shadow-2xs">
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full appearance-none rounded-lg border bg-white py-2 pl-3 pr-8 text-sm text-[#273741] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C41315] focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
          error ? 'border-[#C41315] focus:ring-rose-500' : 'border-[#E2E8EC] hover:border-slate-300'
        } ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const label = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {label}
            </option>
          );
        })}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
        <ChevronDown className="w-4 h-4" aria-hidden="true" />
      </div>
    </div>
  );
}
