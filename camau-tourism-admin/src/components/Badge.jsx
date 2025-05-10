// Badge.jsx
import React from "react";

const COLOR_CLASSES = {
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  orange: "bg-orange-100 text-orange-800",
  gray: "bg-gray-100 text-gray-800",
  // Thêm màu khác nếu cần
};

export default function Badge({ color = "gray", children }) {
  const colorClass = COLOR_CLASSES[color] || COLOR_CLASSES.gray;
  return (
    <span
      className={
        `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`
      }
    >
      {children}
    </span>
  );
}