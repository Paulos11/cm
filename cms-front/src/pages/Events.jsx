// src/pages/Events.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../store/eventsSlice";
import EventForm from "../components/Events/EventForm";
import CalendarView from "../components/Events/CalendarView";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BellIcon, CalendarIcon, UserIcon } from "../components/ui/icons";

const Events = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);
  const eventStatus = useSelector((state) => state.events.status);
  const error = useSelector((state) => state.events.error);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    if (eventStatus === "idle") {
      dispatch(fetchEvents());
    }
  }, [eventStatus, dispatch]);

  const handleAddEvent = (event) => {
    dispatch(createEvent(event));
    toast.success("Event added successfully!");
  };

  const handleUpdateEvent = (id, event) => {
    dispatch(updateEvent({ id, event }));
    toast.success("Event updated successfully!");
  };

  const handleDeleteEvent = (id) => {
    dispatch(deleteEvent(id));
    toast.success("Event deleted successfully!");
  };

  let content;

  if (eventStatus === "loading") {
    content = <div>Loading...</div>;
  } else if (eventStatus === "succeeded") {
    content = (
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event._id} className="p-4 bg-white rounded shadow-md">
            <h3 className="text-lg font-bold">{event.title}</h3>
            <p className="text-gray-600">{event.description}</p>
            <p className="text-gray-600">
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </p>
            <p className="text-gray-600">{event.location}</p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => setSelectedEvent(event)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                View
              </button>
              <button
                onClick={() => handleUpdateEvent(event._id, event)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEvent(event._id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  } else if (eventStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 p-6 md:p-10">
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Upcoming Events</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Check out our upcoming events and reserve your spot.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md">
            <CalendarView
              events={events}
              onDateClick={() => setIsFormVisible(true)}
            />
          </div>
          <div className="mt-6">{content}</div>
        </section>
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Event Details</h2>
            <p className="text-gray-500 dark:text-gray-400">
              View details and reserve your spot for the selected event.
            </p>
          </div>
          {selectedEvent ? (
            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="text-lg font-bold mb-2">{selectedEvent.title}</h3>
              <p className="text-gray-600 mb-2">
                {new Date(selectedEvent.date).toLocaleDateString()} at{" "}
                {selectedEvent.time}
              </p>
              <p className="text-gray-600 mb-2">{selectedEvent.location}</p>
              <p className="text-gray-600 mb-2">{selectedEvent.description}</p>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
                onClick={() => toast.success("Spot reserved!")}
              >
                Reserve Spot
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded shadow-md">
              <p className="text-gray-600">
                Select an event to see the details
              </p>
            </div>
          )}
          {isFormVisible && (
            <div className="mt-6">
              <EventForm onSave={handleAddEvent} />
            </div>
          )}
        </section>
      </main>

      <ToastContainer />
    </div>
  );
};

export default Events;
