import React from 'react';

export default function Input({
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  error = null,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className="relative rounded-lg shadow-2xs">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Icon className="w-4 h-4" aria-hidden="true" />
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border bg-white py-2 text-sm text-[#273741] placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C41315] focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
          Icon ? 'pl-9 pr-3' : 'px-3'
        } ${
          error ? 'border-[#C41315] focus:ring-rose-500' : 'border-[#E2E8EC] hover:border-slate-300'
        } ${className}`}
        {...props}
      />
    </div>
  );
}
