import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../lib/supabase';
import { setProfile } from '../store/slices/profileSlice';
import { User, Phone, Calendar, MapPin, FileText, AlertCircle, Save } from 'lucide-react';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile.profile);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    medical_history: '',
    allergies: '',
    emergency_contact: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
        address: profile.address || '',
        medical_history: profile.medical_history || '',
        allergies: profile.allergies || '',
        emergency_contact: profile.emergency_contact || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage('');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      setMessage(error.message);
    } else {
      dispatch(setProfile(data));
      setMessage('Profile updated successfully!');
      setEditing(false);
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-32" />

        <div className="px-6 pb-6">
          <div className="flex justify-between -mt-16 mb-6">
            <div className="flex space-x-4">
              <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center border-4">
                <User className="w-16 h-16 text-gray-400" />
              </div>
              <div className="pb-2">
                <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
                <p className="text-gray-600">{profile?.email}</p>
              </div>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {message && (
            <div className={`mb-6 px-4 py-3 rounded-lg ${
              message.includes('success')
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              disabled={!editing}
              className="w-full border p-2 rounded"
            />

            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!editing}
              className="w-full border p-2 rounded"
            />

            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              disabled={!editing}
              className="w-full border p-2 rounded"
            />

            {editing && (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
