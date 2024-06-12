import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import membersReducer from "./membersSlice";
import sermonsReducer from "./sermonsSlice";
import eventsReducer from "./eventsSlice";
import offeringsReducer from "./offeringsSlice";
import expensesReducer from "./expensesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    sermons: sermonsReducer,
    events: eventsReducer,
    offerings: offeringsReducer,
    expenses: expensesReducer,
  },
});

export default store;
