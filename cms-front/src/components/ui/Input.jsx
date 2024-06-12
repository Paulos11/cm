// src/components/ui/Input.jsx
import React from "react";

export const Input = ({ type, placeholder, value, onChange, className }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`p-2 border border-gray-300 rounded ${className}`}
    />
  );
};
