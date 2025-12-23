import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

// Admin components
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import DashboardHome from '../../components/admin/DashboardHome';
import BlogManager from '../../components/admin/BlogManager';
import ProjectManager from '../../components/admin/ProjectManager';
import EducationManager from '../../components/admin/EducationManager';
import ContactManager from '../../components/admin/ContactManager';
import SkillManager from '../../components/admin/SkillManager';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { colors, isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Fixed positioning */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64">
            <AdminSidebar isOpen={true} onClose={() => {}} />
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex flex-col w-64 h-full">
              <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Page Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 overflow-y-auto p-4 lg:p-8"
          >
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/blogs/*" element={<BlogManager />} />
              <Route path="/projects/*" element={<ProjectManager />} />
              <Route path="/education/*" element={<EducationManager />} />
              <Route path="/contacts/*" element={<ContactManager />} />
              <Route path="/skills/*" element={<SkillManager />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;