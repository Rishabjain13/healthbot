import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
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
        full_name.full_name || '',
        phone.phone || '',
        date_of_birth.date_of_birth || '',
        gender.gender || '',
        address.address || '',
        medical_history.medical_history || '',
        allergies.allergies || '',
        emergency_contact.emergency_contact || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage('');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...formData,
        updated_at Date().toISOString(),
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-32"></div>

          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end space-x-4">
                <div className="w-32 h-32 bg-white rounded-xl shadow-lg flex items-center justify-center border-4 border-white">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
                <div className="pb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{profile?.full_name}</h1>
                  <p className="text-gray-600">{profile?.email}</p>
                </div>
              </div>

              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover-blue-700 transition font-medium"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {message && (
              <div className={`mb-6 px-4 py-3 rounded-lg ${
                message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md-cols-2 gap-6">
                
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent disabled-gray-50"
                    required
                  />
                </div>

                
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent disabled-gray-50"
                  />
                </div>

                
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent disabled-gray-50"
                  />
                </div>

                
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent disabled-gray-50"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent disabled-gray-50"
                />
              </div>

              
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Medical History
                </label>
                <textarea
                  value={formData.medical_history}
                  onChange={(e) => setFormData({ ...formData, medical_history.target.value })}
                  disabled={!editing}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent disabled-gray-50"
                  placeholder="Previous surgeries, chronic conditions, etc."
                />
              </div>

              
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Allergies
                </label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies.target.value })}
                  disabled={!editing}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent disabled-gray-50"
                  placeholder="Drug allergies, food allergies, etc."
                />
              </div>

              
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact.target.value })}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent disabled-gray-50"
                  placeholder="Name and phone number"
                />
              </div>

              {editing && (
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover-blue-700 transition font-medium disabled-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
