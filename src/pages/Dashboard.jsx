import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { supabase } from '../lib/supabase';
import { Calendar, MessageSquare, FileText, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile.profile);
  const [stats, setStats] = useState({
    upcomingAppointments,
    totalMessages,
    totalFiles,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    const [appointmentsRes, messagesRes, filesRes] = await Promise.all([
      supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date', { ascending })
        .limit(3),
      supabase.from('chat_messages').select('id', { count: 'exact', head }).eq('user_id', user.id),
      supabase.from('file_uploads').select('id', { count: 'exact', head }).eq('user_id', user.id),
    ]);

    setStats({
      upcomingAppointments.data?.length || 0,
      totalMessages.count || 0,
      totalFiles.count || 0,
    });

    setRecentAppointments(appointmentsRes.data || []);
  };

  const statCards = [
    {
      title: 'Upcoming Appointments',
      value.upcomingAppointments,
      icon,
      color: 'bg-blue-500',
      link: '/appointments',
    },
    {
      title: 'Chat Messages',
      value.totalMessages,
      icon,
      color: 'bg-green-500',
      link: '/chat',
    },
    {
      title: 'Medical Files',
      value.totalFiles,
      icon,
      color: 'bg-orange-500',
      link: '/files',
    },
    {
      title: 'Health Score',
      value: '95%',
      icon,
      color: 'bg-cyan-500',
      link: '/profile',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600 mt-1">Here's your health overview for today</p>
      </div>

      <div className="grid grid-cols-1 md-cols-2 lg-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-md transition"
          >
            <div className="flex items-center justify-between">
              
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
            <Link to="/appointments" className="text-blue-600 hover-blue-700 text-sm font-semibold">
              View All
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              No upcoming appointments</p>
              <Link to="/appointments" className="text-blue-600 hover-blue-700 text-sm font-semibold mt-2 inline-block">
                Book an appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{apt.appointment_type}</h3>
                    <p className="text-sm text-gray-600">Dr. {apt.doctor_name}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(apt.appointment_date).toLocaleDateString()} at{' '}
                      {new Date(apt.appointment_date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>

          <div className="space-y-3">
            <Link
              to="/chat"
              className="flex items-center space-x-3 p-4 bg-blue-50 hover-blue-100 rounded-lg transition"
            >
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Chat with AI Assistant</span>
            </Link>

            <Link
              to="/appointments"
              className="flex items-center space-x-3 p-4 bg-green-50 hover-green-100 rounded-lg transition"
            >
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Book Appointment</span>
            </Link>

            <Link
              to="/files"
              className="flex items-center space-x-3 p-4 bg-orange-50 hover-orange-100 rounded-lg transition"
            >
              <FileText className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">Upload Medical Files</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center space-x-3 p-4 bg-cyan-50 hover-cyan-100 rounded-lg transition"
            >
              <CheckCircle2 className="w-5 h-5 text-cyan-600" />
              <span className="font-medium text-gray-900">Update Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
