import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async () => {
    const response = await axios.get("/cms/events");
    return response.data;
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (event, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5009/api/cms/events", event); // Corrected endpoint
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, event }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://localhost:5009/api/cms/events/${id}`, event); // Corrected endpoint
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5009/api/cms/events/${id}`); // Corrected endpoint
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

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
      .addCase(createEvent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || action.error.message;
      })
      .addCase(updateEvent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedEvent = action.payload;
        const existingEvent = state.events.find((event) => event._id === updatedEvent._id);
        if (existingEvent) {
          Object.assign(existingEvent, updatedEvent);
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || action.error.message;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = state.events.filter((event) => event._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message || action.error.message;
      });
  },
});

export default eventsSlice.reducer;
