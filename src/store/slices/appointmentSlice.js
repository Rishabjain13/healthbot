import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  loading: false,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments(state, action) {
      state.appointments = action.payload;
    },
    addAppointment(state, action) {
      state.appointments.unshift(action.payload);
    },
    updateAppointment(state, action) {
      const index = state.appointments.findIndex(
        (apt) => apt.id === action.payload.id
      );
      if (index !== -1) state.appointments[index] = action.payload;
    },
    deleteAppointment(state, action) {
      state.appointments = state.appointments.filter(
        (apt) => apt.id !== action.payload
      );
    },
  },
});

export const {
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
