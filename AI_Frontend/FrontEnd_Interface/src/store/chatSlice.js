import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";

// One thunk that chooses the right endpoint based on selected model
export const sendMessageThunk = createAsyncThunk(
  "chat/sendMessage",
  async (text, { getState, rejectWithValue }) => {
    const trimmed = text.trim();
    if (!trimmed) return rejectWithValue("Empty message");

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
      return { reply };
    } catch (err) {
      return rejectWithValue(err?.message || "Network error");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],           // [{id, sender: "user"|"ai", text, ts}]
    isSending: false,
    error: null,
  },
  reducers: {
    addUserMessage: {
      reducer(state, action) {
        state.messages.push(action.payload);
      },
      prepare(text) {
        return {
          payload: {
            id: nanoid(),
            sender: "user",
            text: text.trim(),
            ts: Date.now(),
          },
        };
      },
    },
    clearChat(state) {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.isSending = false;
        state.messages.push({
          id: nanoid(),
          sender: "ai",
          text: action.payload.reply,
          ts: Date.now(),
        });
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload || "Failed to get response.";
        state.messages.push({
          id: nanoid(),
          sender: "ai",
          text: "Failed to get response.",
          ts: Date.now(),
        });
      });
  },
});

export const { addUserMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
