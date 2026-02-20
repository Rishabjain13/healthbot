import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '../../types';



const initialState = {
  messages,
  loading,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setChatLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setMessages, addMessage, clearMessages, setChatLoading } = chatSlice.actions;
export default chatSlice.reducer;
