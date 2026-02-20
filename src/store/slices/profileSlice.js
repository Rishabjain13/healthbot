import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '../../types';



const initialState = {
  profile,
  loading,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers
    setProfile: (state, action | null>) => {
      state.profile = action.payload;
    },
    setProfileLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateProfile: (state, action) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
});

export const { setProfile, setProfileLoading, updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
