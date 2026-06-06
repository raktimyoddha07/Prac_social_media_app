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

    editMessage: (state, action) => {
      state.messages.forEach((m: any) => {
        console.log(
          "STATE ID:",
          m.id,
          "PAYLOAD ID:",
          action.payload.id,
          "MATCH:",
          m.id === action.payload.id,
        );
      });

      state.messages = state.messages.map((message: any) =>
        message.id === action.payload.id
          ? {
              ...message,
              content: action.payload.content,
            }
          : message,
      );
    },
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(
        (m: any) => m.id !== action.payload,
      );
    },
  },
});

export const {
  setConversations,
  setSelectedConversation,
  setMessages,
  addMessage,
  addConversation,
  editMessage,
  deleteMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
