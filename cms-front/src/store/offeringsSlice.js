// src/features/offerings/offeringsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosSetup";

// Fetch offerings from the backend
export const fetchOfferings = createAsyncThunk(
  "offerings/fetchOfferings",
  async ({ page, limit }) => {
    const response = await axiosInstance.get(`/cms/offerings?page=${page}&limit=${limit}`);
    console.log("Fetched offerings:", response.data);
    return response.data; // Ensure this returns the data as expected
  }
);

// Fetch total offerings from the backend
export const fetchTotalOffering = createAsyncThunk(
  "offerings/fetchTotalOffering",
  async () => {
    const response = await axiosInstance.get("/cms/offeringtotal");
    return response.data.totalOffering;
  }
);

// Add a new offering
export const addOffering = createAsyncThunk(
  "offerings/addOffering",
  async (offering) => {
    const response = await axiosInstance.post("/cms/offering", offering);
    console.log("Added offering:", response.data);
    return response.data;
  }
);

// Update an offering
export const updateOffering = createAsyncThunk(
  "offerings/updateOffering",
  async (offering) => {
    const { id, ...data } = offering;
    const response = await axiosInstance.patch(`/cms/offering/${id}`, data);
    console.log("Updated offering:", response.data);
    return response.data;
  }
);

// Delete an offering
export const deleteOffering = createAsyncThunk(
  "offerings/deleteOffering",
  async (id) => {
    await axiosInstance.delete(`/cms/offering/${id}`);
    console.log("Deleted offering:", id);
    return id;
  }
);

const offeringsSlice = createSlice({
  name: "offerings",
  initialState: {
    offerings: [],
    totalOffering: 0,
    status: "idle",
    error: null,
    page: 1,
    limit: 10,
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfferings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOfferings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.offerings = action.payload || [];
        console.log("Offerings state updated:", state.offerings);
      })
      .addCase(fetchOfferings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.error("Fetching offerings failed:", state.error);
      })
      .addCase(fetchTotalOffering.fulfilled, (state, action) => {
        state.totalOffering = action.payload || 0;
        console.log("Total offering state updated:", state.totalOffering);
      })
      .addCase(addOffering.fulfilled, (state, action) => {
        state.offerings.push(action.payload.offering);
        state.totalOffering = action.payload.totalOffering;
        console.log("Added offering to state:", state.offerings);
        console.log("Updated total offering:", state.totalOffering);
      })
      .addCase(updateOffering.fulfilled, (state, action) => {
        const index = state.offerings.findIndex(
          (offering) => offering._id === action.payload._id
        );
        if (index !== -1) {
          state.offerings[index] = action.payload;
        }
        console.log("Updated offering in state:", state.offerings);
      })
      .addCase(deleteOffering.fulfilled, (state, action) => {
        state.offerings = state.offerings.filter(
          (offering) => offering._id !== action.payload
        );
        console.log("Deleted offering from state:", state.offerings);
      });
  },
});

export const { setPage } = offeringsSlice.actions;

export default offeringsSlice.reducer;
