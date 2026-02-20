import { Bell, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function Header() {
  const profile = useSelector((state) => state.profile.profile);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients, appointments, or files..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus-2 focus-blue-500 focus-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-6">
          <button className="relative p-2 text-gray-600 hover-gray-100 rounded-lg transition">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500">Patient</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
