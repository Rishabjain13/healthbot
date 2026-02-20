import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';



const initialState = {
  user,
  loading,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers
    setUser: (state, action | null>) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
