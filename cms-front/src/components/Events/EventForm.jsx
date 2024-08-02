import React, { useState } from "react";

const EventForm = ({ selectedDate, onSave, onClose, event }) => {
  const [title, setTitle] = useState(event ? event.title : "");
  const [description, setDescription] = useState(event ? event.description : "");
  const [time, setTime] = useState(event ? event.time : "");
  const [location, setLocation] = useState(event ? event.location : "");
  const [color, setColor] = useState(event ? event.color : "#0000FF");

  const handleSubmit = (e) => {
    e.preventDefault();
    const createdBy = "60d0fe4f5311236168a109ca"; // Example ObjectId
    const eventData = { title, description, date: selectedDate, time, location, color, createdBy };
    onSave(eventData);
    onClose();
    setTitle("");
    setDescription("");
    setTime("");
    setLocation("");
    setColor("#0000FF");
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{event ? "Edit Event" : "Add Event"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✖</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div>
            <label className="block text-gray-700">Color</label>
            <div className="flex space-x-2 mt-1">
              {["#FFA500", "#FF0000", "#008000", "#0000FF"].map((col) => (
                <div
                  key={col}
                  className={`w-6 h-6 rounded-full cursor-pointer ${color === col ? "border-2 border-black" : ""}`}
                  style={{ backgroundColor: col }}
                  onClick={() => setColor(col)}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
            {event ? "Update Event" : "Save Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
