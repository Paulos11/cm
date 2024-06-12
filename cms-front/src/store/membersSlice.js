// src/store/membersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const handleFormData = (member) => {
  const formData = new FormData();
  for (const key in member) {
    formData.append(key, member[key]);
  }
  return formData;
};

export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async ({ page, limit }) => {
    const response = await axios.get(
      `http://localhost:5009/api/cms/members?page=${page}&limit=${limit}`
    );
    return response.data;
  }
);

export const fetchAllMembers = createAsyncThunk(
  "members/fetchAllMembers",
  async () => {
    const response = await axios.get(
      "http://localhost:5009/api/cms/members?all=true"
    );
    return response.data;
  }
);

export const fetchTotalMembers = createAsyncThunk(
  "members/fetchTotalMembers",
  async () => {
    const response = await axios.get(
      "http://localhost:5009/api/cms/totalmembers"
    );
    return response.data.totalMembers;
  }
);

export const fetchBirthdaysThisMonth = createAsyncThunk(
  "members/fetchBirthdaysThisMonth",
  async () => {
    const response = await axios.get("http://localhost:5009/api/cms/birthdays");
    return response.data;
  }
);

export const fetchNewlyJoinedThisMonth = createAsyncThunk(
  "members/fetchNewlyJoinedThisMonth",
  async () => {
    const response = await axios.get(
      "http://localhost:5009/api/cms/newlyjoined"
    );
    return response.data;
  }
);

export const addMember = createAsyncThunk(
  "members/addMember",
  async (member) => {
    const formData = handleFormData(member);
    const response = await axios.post(
      "http://localhost:5009/api/cms/member",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
);

export const updateMember = createAsyncThunk(
  "members/updateMember",
  async (member) => {
    const { id } = member;
    const formData = handleFormData(member);
    const response = await axios.put(
      `http://localhost:5009/api/cms/member/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
);

export const deleteMember = createAsyncThunk(
  "members/deleteMember",
  async (id) => {
    await axios.delete(`http://localhost:5009/api/cms/member/${id}`);
    return id;
  }
);

const membersSlice = createSlice({
  name: "members",
  initialState: {
    members: [],
    allMembers: [],
    total: 0,
    birthdaysThisMonth: [],
    newlyJoinedThisMonth: [],
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
      .addCase(fetchMembers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.members = action.payload.members;
        state.total = action.payload.total;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAllMembers.fulfilled, (state, action) => {
        state.allMembers = action.payload.members;
      })
      .addCase(fetchTotalMembers.fulfilled, (state, action) => {
        state.total = action.payload;
      })
      .addCase(fetchBirthdaysThisMonth.fulfilled, (state, action) => {
        state.birthdaysThisMonth = action.payload;
      })
      .addCase(fetchNewlyJoinedThisMonth.fulfilled, (state, action) => {
        state.newlyJoinedThisMonth = action.payload;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.members.push(action.payload.member);
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        const index = state.members.findIndex(
          (member) => member.id === action.payload.id
        );
        state.members[index] = action.payload;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.members = state.members.filter(
          (member) => member.id !== action.payload
        );
      });
  },
});

export const { setPage } = membersSlice.actions;

export default membersSlice.reducer;
