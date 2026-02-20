import { NavLink, useNavigate } from 'react-router-dom';
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

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/chat', icon: MessageSquare, label: 'AI Assistant' },
    { to: '/files', icon: FileText, label: 'Medical Files' },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">HealthCare</h1>
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
              `flex items-center space-x-3 px-4 py-3 rounded-lg ${
                isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
