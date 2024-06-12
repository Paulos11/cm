import React from "react";

const Card = ({ title, value, onClick }) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-10 transition-transform duration-300 cursor-pointer"
      onClick={onClick}
    >
      <h3 className="text-xl font-bold text-gray-700 mb-2">{title}</h3>
      <p className="text-3xl font-semibold text-blue-500">{value}</p>
    </div>
  );
};

export default Card;
