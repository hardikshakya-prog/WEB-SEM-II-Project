import { configureStore } from "@reduxjs/toolkit";
import aiReducer from "./aiSlice";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    ai: aiReducer,
    chat: chatReducer,
  },
});
