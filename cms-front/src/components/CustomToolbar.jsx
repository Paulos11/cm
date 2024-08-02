import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CustomToolbar = ({ label, onNavigate, date }) => {
  const handleYearChange = (e) => {
    const newDate = new Date(date);
    newDate.setFullYear(e.target.value);
    onNavigate('date', newDate);
  };

  const handleMonthChange = (e) => {
    const newDate = new Date(date);
    newDate.setMonth(e.target.value);
    onNavigate('date', newDate);
  };

  const years = [];
  for (let i = 2000; i <= 2030; i++) {
    years.push(i);
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <button onClick={() => onNavigate('PREV')} className="mr-2">
          <FaChevronLeft />
        </button>
        <span className="mx-2">{label}</span>
        <button onClick={() => onNavigate('NEXT')} className="ml-2">
          <FaChevronRight />
        </button>
      </div>
      <div className="flex items-center">
        <select className="mr-2" onChange={handleMonthChange} value={date.getMonth()}>
          {months.map((month, idx) => (
            <option key={idx} value={idx}>{month}</option>
          ))}
        </select>
        <select onChange={handleYearChange} value={date.getFullYear()}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomToolbar;
