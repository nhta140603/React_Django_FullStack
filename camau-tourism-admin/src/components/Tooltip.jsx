import React from "react";

export default function Tooltip({ children, label }) {
  return (
    <span className="relative group">
      <span
        className="
          truncate max-w-[130px] block cursor-pointer
          outline-none
        "
        tabIndex={0}
        aria-describedby="tooltip"
      >
        {children}
      </span>
      <span
        id="tooltip"
        className="
          pointer-events-none
          absolute left-1/2 z-10
          -translate-x-1/2 mt-2
          w-max max-w-xs px-3 py-2
          rounded bg-gray-800 text-white text-xs
          opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
          transition-opacity
          whitespace-pre-line
        "
        role="tooltip"
      >
        {label}
      </span>
    </span>
  );
};
