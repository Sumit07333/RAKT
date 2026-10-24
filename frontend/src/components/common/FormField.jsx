import React from 'react';

export default function FormField({
  id,
  label,
  required = false,
  error = null,
  hint = null,
  children,
  className = ''
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-[#273741]"
        >
          {label}
          {required && <span className="text-[#C41315] ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-[#C41315]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
