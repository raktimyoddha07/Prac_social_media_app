import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  selectedConversation: JSON.parse(
    localStorage.getItem("selectedConversation") || "null",
  ),
  messages: [],
};
const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },

    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
      localStorage.setItem(
        "selectedConversation",
        JSON.stringify(action.payload),
      );
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    
    addConversation: (state, action) => {
      const exists = state.conversations.some(
        (c) => c.id === action.payload.id,
      );

      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },
  },
});

export const {
  setConversations,
  setSelectedConversation,
  setMessages,
  addMessage,
  addConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
