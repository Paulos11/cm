// src/store/eventsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const response = await axios.get("/api/events");
  return response.data;
});

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (event) => {
    const response = await axios.post("/api/events", event);
    return response.data;
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, event }) => {
    const response = await axios.put(`/api/events/${id}`, event);
    return response.data;
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id) => {
    await axios.delete(`/api/events/${id}`);
    return id;
  }
);

export const saveDay = createAsyncThunk("events/saveDay", async (date) => {
  const response = await axios.post("/api/savedDays", { date });
  return response.data;
});

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    savedDays: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const { id, event } = action.payload;
        const existingEvent = state.events.find((event) => event._id === id);
        if (existingEvent) {
          Object.assign(existingEvent, event);
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(
          (event) => event._id !== action.payload
        );
      })
      .addCase(saveDay.fulfilled, (state, action) => {
        state.savedDays.push(action.payload);
      });
  },
});

export default eventsSlice.reducer;
