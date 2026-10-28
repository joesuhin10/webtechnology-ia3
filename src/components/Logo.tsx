import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export function Logo({ className = '', showTagline = false }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Stationery Logo Icon: Pen Nib + Paper Sheet + Bag Accent */}
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1D3557] to-[#2B3A67] p-2 flex items-center justify-center text-white shadow-md shadow-[#1D3557]/15 group-hover:scale-105 transition-transform duration-200">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-amber-300"
        >
          {/* Paper folded outline */}
          <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2z" stroke="#F4A261" />
          {/* Fold corner */}
          <polyline points="14 2 14 8 20 8" stroke="#F4A261" />
          {/* Fountain pen nib diagonal writing across */}
          <path d="m12 18-3 1 1-3 5-5 2 2-5 5z" fill="#E07A5F" stroke="white" strokeWidth="1.5" />
          <path d="m13 13 2 2" stroke="white" strokeWidth="1.5" />
        </svg>
        {/* Subtle orange stationery paperclip dot */}
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white ring-1 ring-amber-500/20" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1 font-bold text-xl tracking-tight text-[#1D3557] font-sans">
          <span>Smart</span>
          <span className="text-amber-600">Station</span>
        </div>
        {showTagline && (
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 -mt-1">
            Write · Create · Organize
          </span>
        )}
      </div>
    </Link>
  );
}
