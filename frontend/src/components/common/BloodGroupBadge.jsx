import React from 'react';

export default function BloodGroupBadge({ bloodGroup, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-bold',
    md: 'text-sm px-2.5 py-1 font-bold',
    lg: 'text-base px-3.5 py-1.5 font-extrabold',
    xl: 'text-xl px-4 py-2 font-black'
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-red-50 text-[#C41315] border border-red-200 tracking-tight font-sans shadow-xs ${sizeClasses[size] || sizeClasses.md} ${className}`}
      aria-label={`Blood Group ${bloodGroup}`}
    >
      {bloodGroup}
    </span>
  );
}
