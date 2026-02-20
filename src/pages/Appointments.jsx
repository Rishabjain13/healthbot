import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { supabase } from '../lib/supabase';
import { setAppointments, addAppointment, updateAppointment, deleteAppointment } from '../store/slices/appointmentSlice';
import { Calendar, Clock, Plus, Edit2, Trash2, X } from 'lucide-react';

export default function Appointments() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const appointments = useSelector((state) => state.appointments.appointments);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    appointment_date: '',
    appointment_type: '',
    doctor_name: '',
    department: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending });

    if (data) {
      dispatch(setAppointments(data));
    }
  };

  const handleSubmit = async (e.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    if (editingId) {
      const { data } = await supabase
        .from('appointments')
        .update({
          ...formData,
          updated_at Date().toISOString(),
        })
        .eq('id', editingId)
        .select()
        .single();

      if (data) {
        dispatch(updateAppointment(data));
      }
    } else {
      const { data } = await supabase
        .from('appointments')
        .insert([
          {
            user_id.id,
            ...formData,
          },
        ])
        .select()
        .single();

      if (data) {
        dispatch(addAppointment(data));
      }
    }

    setLoading(false);
    handleCloseModal();
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.id);
    setFormData({
      appointment_date.appointment_date.slice(0, 16),
      appointment_type.appointment_type,
      doctor_name.doctor_name,
      department.department,
      notes.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    await supabase.from('appointments').delete().eq('id', id);
    dispatch(deleteAppointment(id));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      appointment_date: '',
      appointment_type: '',
      doctor_name: '',
      department: '',
      notes: '',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled' 'bg-blue-100 text-blue-700';
      case 'completed' 'bg-green-100 text-green-700';
      case 'cancelled' 'bg-red-100 text-red-700';
      default 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-1">Manage your medical appointments</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover-blue-700 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Book Appointment</span>
          </button>
        </div>

        <div className="grid gap-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments yet</h3>
              <p className="text-gray-600 mb-4">Book your first appointment to get started</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover-blue-700 transition font-medium"
              >
                <Plus className="w-5 h-5" />
                Book Appointment</span>
              </button>
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          
                            <h3 className="text-xl font-bold text-gray-900">{apt.appointment_type}</h3>
                            <p className="text-gray-600 mt-1">Dr. {apt.doctor_name}</p>
                            <p className="text-sm text-gray-500">{apt.department}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(apt.appointment_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            
                              {new Date(apt.appointment_date).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        {apt.notes && (
                          <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{apt.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(apt)}
                      className="p-2 text-blue-600 hover-blue-50 rounded-lg transition"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(apt.id)}
                      className="p-2 text-red-600 hover-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Edit Appointment' : 'Book New Appointment'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent"
                  required
                />
              </div>

              
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type
                </label>
                <select
                  value={formData.appointment_type}
                  onChange={(e) => setFormData({ ...formData, appointment_type.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="General Checkup">General Checkup</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Vaccination">Vaccination</option>
                  <option value="Lab Test">Lab Test</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={formData.doctor_name}
                  onChange={(e) => setFormData({ ...formData, doctor_name.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent"
                  placeholder="Dr. Smith"
                  required
                />
              </div>

              
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent"
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="General Medicine">General Medicine</option>
                </select>
              </div>

              
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent"
                  placeholder="Any additional information..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover-blue-700 transition font-medium disabled-50"
                >
                  {loading ? 'Saving...'  ? 'Update' : 'Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
