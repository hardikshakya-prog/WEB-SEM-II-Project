import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  messages: [],   
  isSending: false,
  error: null,
};

// Slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

    addUserMessage(state, action) {
      state.messages.push({
        id: Date.now(),         
        sender: "user",
        text: action.payload.trim(),
        ts: Date.now(),
      });
    },


    clearChat(state) {
      state.messages = [];
      state.error = null;
    },

    sendMessageStart(state) {
      state.isSending = true;
      state.error = null;
    },

    sendMessageSuccess(state, action) {
      state.isSending = false;
      state.messages.push({
        id: Date.now(),
        sender: "ai",
        text: action.payload,
        ts: Date.now(),
      });
    },


    sendMessageError(state, action) {
      state.isSending = false;
      state.error = action.payload;
      state.messages.push({
        id: Date.now(),
        sender: "ai",
        text: "Failed to get response.",
        ts: Date.now(),
      });
    },
  },
});


export const sendMessage = (text) => async (dispatch, getState) => {
  const trimmed = text.trim();
  if (!trimmed) return;

  dispatch(sendMessageStart());

  const { ai: { selectedModel } } = getState();
  const endpoint =
    selectedModel === "gemma"
      ? "http://127.0.0.1:5001/api/GEMMA"
      : "http://127.0.0.1:5000/api/translate";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });
    const data = await res.json();
    const reply = (data.response || "Error getting reply").trim();
    dispatch(sendMessageSuccess(reply));
  } catch (err) {
    dispatch(sendMessageError(err?.message || "Network error"));
  }
};


export const { addUserMessage, clearChat, sendMessageStart, sendMessageSuccess, sendMessageError } = chatSlice.actions;


export default chatSlice.reducer;