import React from 'react';
import { Menu, User, Bell, Sun, Moon, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AdminHeader = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border-b px-4 lg:px-8 py-4 sticky top-0 z-30 backdrop-blur-sm transition-colors duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className={`lg:hidden ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} transition-all p-2 rounded-lg`}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className={`text-xl lg:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
              Portfolio Admin
            </h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'} text-sm hidden sm:block transition-colors`}>
              Manage your portfolio content
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className={`relative p-2 rounded-lg transition-all duration-300 ${
              isDark 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <div className="relative w-6 h-6">
              <Sun className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
              }`} />
              <Moon className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
              }`} />
            </div>
          </button>

          {/* Notifications */}
          <button className={`relative p-2 rounded-lg transition-all ${
            isDark 
              ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}>
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
          {/* User Profile */}
          <div className={`flex items-center space-x-3 ${isDark ? 'bg-slate-800' : 'bg-gray-100'} rounded-xl px-3 py-2 transition-colors duration-300`}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>
                {user?.username}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'} transition-colors`}>
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;