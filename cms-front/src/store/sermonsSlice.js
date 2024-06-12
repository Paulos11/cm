import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axiosSetup";
import { toast } from "react-toastify";

// Async actions
export const fetchSermons = createAsyncThunk(
  "sermons/fetchSermons",
  async () => {
    const response = await axios.get("/cms/sermons");
    return response.data;
  }
);

export const addSermon = createAsyncThunk(
  "sermons/addSermon",
  async (sermon) => {
    const response = await axios.post("/cms/sermons", sermon);
    return response.data;
  }
);

export const updateSermon = createAsyncThunk(
  "sermons/updateSermon",
  async ({ id, sermon }) => {
    const response = await axios.patch(`/cms/sermons/${id}`, sermon);
    return response.data;
  }
);

export const deleteSermon = createAsyncThunk(
  "sermons/deleteSermon",
  async (id) => {
    await axios.delete(`/cms/sermons/${id}`);
    return id;
  }
);

const sermonsSlice = createSlice({
  name: "sermons",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSermons.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSermons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchSermons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(`Error: ${action.error.message}`);
      })
      .addCase(addSermon.fulfilled, (state, action) => {
        state.items.push(action.payload);
        toast.success("Sermon added successfully");
      })
      .addCase(addSermon.rejected, (state, action) => {
        state.error = action.error.message;
        toast.error(`Error: ${action.error.message}`);
      })
      .addCase(updateSermon.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (sermon) => sermon._id === action.payload._id
        );
        state.items[index] = action.payload;
        toast.success("Sermon updated successfully");
      })
      .addCase(updateSermon.rejected, (state, action) => {
        state.error = action.error.message;
        toast.error(`Error: ${action.error.message}`);
      })
      .addCase(deleteSermon.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (sermon) => sermon._id !== action.payload
        );
        toast.success("Sermon deleted successfully");
      })
      .addCase(deleteSermon.rejected, (state, action) => {
        state.error = action.error.message;
        toast.error(`Error: ${action.error.message}`);
      });
  },
});

export default sermonsSlice.reducer;
