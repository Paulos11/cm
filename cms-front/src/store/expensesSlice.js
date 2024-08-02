import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosSetup";

// Fetch expenses from the backend
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async ({ page, limit, startDate, endDate }) => {
    const response = await axiosInstance.get(
      `/cms/expense?page=${page}&limit=${limit}&startDate=${startDate || ''}&endDate=${endDate || ''}`
    );
    console.log("Fetched expenses:", response.data);
    return response.data;
  }
);

// Fetch total expenses from the backend
export const fetchTotalExpenses = createAsyncThunk(
  "expenses/fetchTotalExpenses",
  async () => {
    const response = await axiosInstance.get("/cms/total-expenses");
    console.log("Fetched total expenses:", response.data.totalExpenses);
    return response.data.totalExpenses;
  }
);

// Add a new expense
export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expense) => {
    const response = await axiosInstance.post("/cms/expense", expense);
    console.log("Added expense:", response.data);
    return response.data;
  }
);

// Update an expense
export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async (expense) => {
    const { id, ...data } = expense;
    const response = await axiosInstance.patch(`/cms/expense/${id}`, data);
    console.log("Updated expense:", response.data);
    return response.data;
  }
);

// Delete an expense
export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id) => {
    await axiosInstance.delete(`/cms/expense/${id}`);
    console.log("Deleted expense:", id);
    return id;
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: [],
    totalExpenses: 0,
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
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses = action.payload || [];
        console.log("Expenses state updated:", state.expenses);
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.error("Fetching expenses failed:", state.error);
      })
      .addCase(fetchTotalExpenses.fulfilled, (state, action) => {
        state.totalExpenses = action.payload || 0;
        console.log("Total expenses state updated:", state.totalExpenses);
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
        state.totalExpenses += action.payload.amount;
        console.log("Added expense to state:", state.expenses);
        console.log("Updated total expenses:", state.totalExpenses);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (expense) => expense._id === action.payload._id
        );
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
        console.log("Updated expense in state:", state.expenses);
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(
          (expense) => expense._id !== action.payload
        );
        console.log("Deleted expense from state:", state.expenses);
      });
  },
});

export const { setPage } = expensesSlice.actions;

export default expensesSlice.reducer;
