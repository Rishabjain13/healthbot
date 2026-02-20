import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Calendar,
  MessageSquare,
  FileText,
  LogOut,
  Heart,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon, label: 'Dashboard' },
    { to: '/profile', icon, label: 'Profile' },
    { to: '/appointments', icon, label: 'Appointments' },
    { to: '/chat', icon, label: 'AI Assistant' },
    { to: '/files', icon, label: 'Medical Files' },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          
            <h1 className="text-xl font-bold text-gray-900">HealthCare</h1>
            <p className="text-xs text-gray-500">AI Assistant</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover-red-50 transition w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
