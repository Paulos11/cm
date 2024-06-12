// src/components/EventForm.jsx
import React, { useState } from "react";

const EventForm = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description, date, time, location });
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md space-y-4"
    >
      <div>
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div>
        <label className="block text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div>
        <label className="block text-gray-700">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div>
        <label className="block text-gray-700">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Save Event
      </button>
    </form>
  );
};

export default EventForm;
