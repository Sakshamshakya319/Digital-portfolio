import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FileText, 
  FolderOpen, 
  GraduationCap, 
  Mail, 
  Code, 
  X,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { colors, isDark } = useTheme();

  const menuItems = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/blogs', icon: FileText, label: 'Blog Posts' },
    { path: '/admin/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/admin/education', icon: GraduationCap, label: 'Education' },
    { path: '/admin/contacts', icon: Mail, label: 'Contact Messages' },
    { path: '/admin/skills', icon: Code, label: 'Skills' },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border-r transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-6 ${isDark ? 'border-slate-800' : 'border-gray-200'} border-b`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Panel</h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Portfolio Management</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`lg:hidden ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors p-1 rounded-md hover:bg-opacity-10 hover:bg-gray-500`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/admin' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : isDark 
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 bg-white rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`p-4 ${isDark ? 'border-slate-800' : 'border-gray-200'} border-t`}>
        <button
          onClick={handleLogout}
          className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
            isDark 
              ? 'text-slate-300 hover:bg-red-500/10 hover:text-red-400' 
              : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;