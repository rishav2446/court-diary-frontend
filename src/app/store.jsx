import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import casesReducer from "../features/cases/casesSlice";
import diaryReducer from "../features/diary/diarySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cases: casesReducer,
    diary: diaryReducer,
  },
});