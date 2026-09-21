'use client';

import React, { useState } from 'react';

interface PersianTranslationToggleProps {
  children: React.ReactNode;
}

export const PersianTranslationToggle: React.FC<PersianTranslationToggleProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          فارسی
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="text-[11px] font-semibold text-[#1554bd] hover:underline focus:outline-none"
        >
          {isOpen ? 'Hide Persian' : 'Show Persian'}
        </button>
      </div>

      {isOpen && children}
    </div>
  );
};
