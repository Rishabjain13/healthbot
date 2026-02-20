import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment } from '../../types';



const initialState = {
  appointments,
  loading,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    addAppointment: (state, action) => {
      state.appointments.unshift(action.payload);
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(apt => apt.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    deleteAppointment: (state, action) => {
      state.appointments = state.appointments.filter(apt => apt.id !== action.payload);
    },
    setAppointmentLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAppointments, addAppointment, updateAppointment, deleteAppointment, setAppointmentLoading } = appointmentSlice.actions;
export default appointmentSlice.reducer;
