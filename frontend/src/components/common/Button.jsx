import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-55 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary: 'bg-[#C41315] hover:bg-[#A20D10] active:bg-[#8F1238] text-white shadow-sm focus:ring-[#C41315]',
    secondary: 'bg-[#273741] hover:bg-[#1E2B33] text-white shadow-sm focus:ring-[#273741]',
    outline: 'border border-[#E2E8EC] bg-white text-[#273741] hover:bg-[#F8FAFC] hover:border-slate-300 shadow-2xs focus:ring-[#C41315]',
    ghost: 'text-[#273741] hover:bg-[#EEF2F4] focus:ring-[#273741]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5 font-semibold'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
          {children}
        </>
      )}
    </button>
  );
}
