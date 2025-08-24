import { createSlice } from "@reduxjs/toolkit";

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    selectedModel: "phi", // default: "phi" or "gemma"
  },
  reducers: {
    setModel: (state, action) => {
      state.selectedModel = action.payload;
    },
  },
});

export const { setModel } = aiSlice.actions;
export default aiSlice.reducer;