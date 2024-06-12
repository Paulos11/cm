// src/components/CalendarView.jsx
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarView = ({ events, onDateClick }) => {
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayEvents = events.filter(
        (event) => new Date(event.date).toDateString() === date.toDateString()
      );
      return dayEvents.length ? (
        <ul>
          {dayEvents.map((event) => (
            <li key={event._id} className="text-sm text-blue-600">
              {event.title}
            </li>
          ))}
        </ul>
      ) : null;
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <Calendar tileContent={tileContent} onClickDay={onDateClick} />
    </div>
  );
};

export default CalendarView;
