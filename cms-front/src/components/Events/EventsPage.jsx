// src/components/EventsPage.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../features/events/eventsSlice";
import EventForm from "./EventForm";

const EventsPage = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);
  const eventStatus = useSelector((state) => state.events.status);
  const error = useSelector((state) => state.events.error);

  useEffect(() => {
    if (eventStatus === "idle") {
      dispatch(fetchEvents());
    }
  }, [eventStatus, dispatch]);

  const handleAddEvent = (event) => {
    dispatch(createEvent(event));
  };

  const handleUpdateEvent = (id, event) => {
    dispatch(updateEvent({ id, event }));
  };

  const handleDeleteEvent = (id) => {
    dispatch(deleteEvent(id));
  };

  let content;

  if (eventStatus === "loading") {
    content = <div>Loading...</div>;
  } else if (eventStatus === "succeeded") {
    content = (
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <button onClick={() => handleUpdateEvent(event._id, event)}>
              Edit
            </button>
            <button onClick={() => handleDeleteEvent(event._id)}>Delete</button>
          </li>
        ))}
      </ul>
    );
  } else if (eventStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <div>
      <h2>Events</h2>
      <EventForm onSave={handleAddEvent} />
      {content}
    </div>
  );
};

export default EventsPage;
