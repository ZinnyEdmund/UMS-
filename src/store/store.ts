import  { configureStore } from '@reduxjs/toolkit';
import { useReducer } from "./Stores/UserSlice";

// Configure redux store with user reducer
export const store = configureStore({
  reducer: {
    users: useReducer, // It manages user related state
  },
});

// TypeScript types for better safety in redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
