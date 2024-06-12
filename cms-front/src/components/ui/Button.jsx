// src/components/ui/Button.jsx
import React from "react";

export const Button = ({ variant, size, children, ...props }) => {
  const baseClasses =
    "px-4 py-2 rounded inline-flex items-center justify-center";
  const variantClasses = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-500 text-white",
    ghost: "bg-transparent text-blue-500",
  };
  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
    icon: "p-2",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
