"use client";

import { useState } from "react";

interface ChecklistProps {
  items: string[];
}

export default function Checklist({ items }: ChecklistProps) {
  const [checkedStates, setCheckedStates] = useState<boolean[]>(
    new Array(items.length).fill(false)
  );

  const toggleCheck = (index: number) => {
    setCheckedStates((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <ul className="flex flex-col gap-3 list-none p-0">
      {items.map((item, index) => {
        const isChecked = checkedStates[index];
        return (
          <li key={index}>
            <button
              onClick={() => toggleCheck(index)}
              className={`flex items-center gap-3 py-4 px-5 cursor-pointer w-full glass-panel border ${
                isChecked ? "border-primary bg-primary/3" : "border-card-border"
              }`}
            >
              <div
                className={`w-5 h-5 border-2 rounded-[6px] flex items-center justify-center transition-all duration-300 shrink-0 ${
                  isChecked ? "border-primary bg-primary text-black" : "border-text-muted bg-transparent"
                }`}
              >
                {isChecked && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span
                className={`text-[0.95rem] transition-all duration-300 ${
                  isChecked ? "text-text-muted line-through" : "text-text-secondary"
                }`}
              >
                {item}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
