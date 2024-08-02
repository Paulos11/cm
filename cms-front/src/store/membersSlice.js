import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axiosSetup";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/cms/members?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllMembers = createAsyncThunk(
  "members/fetchAllMembers",
  async (_, { rejectWithValue }) => {
    let attempts = 0;
    const maxAttempts = 5;
    const baseDelay = 1000;

    while (attempts < maxAttempts) {
      try {
        const response = await axios.get("/cms/members?all=true");
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          attempts++;
          const delayTime = baseDelay * Math.pow(2, attempts);
          console.error(`Retry attempt ${attempts}, delaying for ${delayTime} ms`);
          await delay(delayTime);
        } else {
          console.error("Error fetching all members:", error);
          return rejectWithValue(error.response?.data || error.message);
        }
      }
    }

    return rejectWithValue("Max retry attempts reached. Please try again later.");
  }
);

export const fetchTotalMembers = createAsyncThunk(
  "members/fetchTotalMembers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/cms/totalmembers");
      return response.data.total;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addMember = createAsyncThunk(
  "members/addMember",
  async (memberData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/cms/member", memberData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateMember = createAsyncThunk(
  "members/updateMember",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/cms/member/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteMember = createAsyncThunk(
  "members/deleteMember",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/cms/member/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  members: [],
  allMembers: [],
  total: 0,
  status: 'idle',
  error: null,
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.members = action.payload.members;
        state.total = action.payload.total;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAllMembers.fulfilled, (state, action) => {
        state.allMembers = action.payload;
      })
      .addCase(fetchTotalMembers.fulfilled, (state, action) => {
        state.total = action.payload;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.members.push(action.payload);
        state.total += 1;
      })
      .addCase(addMember.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        const index = state.members.findIndex(member => member._id === action.payload._id);
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.members = state.members.filter(member => member._id !== action.payload);
        state.total -= 1;
      });
  },
});

export default membersSlice.reducer;
