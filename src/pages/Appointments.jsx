import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../lib/supabase';
import {
  setAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from '../store/slices/appointmentSlice';

export default function Appointments() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const appointments = useSelector((state) => state.appointments.appointments);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    appointment_date: '',
    appointment_type: '',
    doctor_name: '',
    department: '',
    notes: '',
  });

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id);

    dispatch(setAppointments(data || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      const { data } = await supabase
        .from('appointments')
        .update({ ...formData })
        .eq('id', editingId)
        .select()
        .single();

      dispatch(updateAppointment(data));
    } else {
      const { data } = await supabase
        .from('appointments')
        .insert([{ user_id: user.id, ...formData }])
        .select()
        .single();

      dispatch(addAppointment(data));
    }

    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Appointments</h1>
      {appointments.map((apt) => (
        <div key={apt.id}>{apt.appointment_type}</div>
      ))}
    </div>
  );
}
