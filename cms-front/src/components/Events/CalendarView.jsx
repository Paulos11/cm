import React from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from "../CustomToolbar"; // Import the custom toolbar

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const CalendarView = ({ events, onDateClick }) => {
  const handleSelectSlot = ({ start }) => {
    onDateClick(start);
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color || "#0000FF"; // Default color is blue
    const style = {
      backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return {
      style: style,
    };
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full h-full">
      <Calendar
        localizer={localizer}
        events={events.map(event => ({
          ...event,
          start: new Date(event.date),
          end: new Date(event.date),
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={event => console.log("View event", event)}
        views={{ month: true, week: true, day: true, agenda: true }}
        defaultView="month"
        eventPropGetter={eventStyleGetter}
        components={{
          toolbar: CustomToolbar // Use the custom toolbar
        }}
      />
    </div>
  );
};

export default CalendarView;
