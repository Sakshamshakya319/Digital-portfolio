import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  FolderOpen, 
  Mail, 
  Code, 
  Eye, 
  TrendingUp,
  Users,
  MessageSquare
} from 'lucide-react';
import { blogAPI, projectAPI, contactAPI, skillAPI } from '../../services/api';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    contacts: 0,
    skills: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogsRes, projectsRes, contactsRes, skillsRes] = await Promise.all([
        blogAPI.getAllAdmin().catch(() => ({ data: { blogs: [] } })),
        projectAPI.getAll().catch(() => ({ data: [] })),
        contactAPI.getAll().catch(() => ({ data: { contacts: [] } })),
        skillAPI.getAllAdmin().catch(() => ({ data: [] }))
      ]);

      setStats({
        blogs: blogsRes.data.total || blogsRes.data.blogs?.length || 0,
        projects: projectsRes.data.length || 0,
        contacts: contactsRes.data.total || contactsRes.data.contacts?.length || 0,
        skills: skillsRes.data.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'blog':
        navigate('/admin/blogs');
        break;
      case 'project':
        navigate('/admin/projects');
        break;
      case 'messages':
        navigate('/admin/contacts');
        break;
      default:
        break;
    }
  };

  const statCards = [
    {
      title: 'Blog Posts',
      value: stats.blogs,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      path: '/admin/blogs'
    },
    {
      title: 'Projects',
      value: stats.projects,
      icon: FolderOpen,
      color: 'from-green-500 to-green-600',
      change: '+8%',
      path: '/admin/projects'
    },
    {
      title: 'Messages',
      value: stats.contacts,
      icon: Mail,
      color: 'from-purple-500 to-purple-600',
      change: '+23%',
      path: '/admin/contacts'
    },
    {
      title: 'Skills',
      value: stats.skills,
      icon: Code,
      color: 'from-orange-500 to-orange-600',
      change: '+5%',
      path: '/admin/skills'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Dashboard Overview</h1>
        <p className="text-slate-400 text-lg">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => navigate(card.path)}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-green-500 font-medium">{card.change}</span>
                <span className="text-slate-400 ml-2">from last month</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.button 
            onClick={() => handleQuickAction('blog')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-4 p-6 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Create New Blog Post</h3>
              <p className="text-slate-400 text-sm">Write and publish articles</p>
            </div>
          </motion.button>
          
          <motion.button 
            onClick={() => handleQuickAction('project')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-4 p-6 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
              <FolderOpen className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Add New Project</h3>
              <p className="text-slate-400 text-sm">Showcase your work</p>
            </div>
          </motion.button>
          
          <motion.button 
            onClick={() => handleQuickAction('messages')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-4 p-6 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
              <MessageSquare className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">View Messages</h3>
              <p className="text-slate-400 text-sm">Check contact inquiries</p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/40 transition-colors">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-white font-medium">New contact message received</p>
              <p className="text-slate-400 text-sm mt-1">Someone is interested in your services</p>
              <p className="text-slate-500 text-xs mt-2">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/40 transition-colors">
            <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-white font-medium">Blog post published successfully</p>
              <p className="text-slate-400 text-sm mt-1">Your latest article is now live</p>
              <p className="text-slate-500 text-xs mt-2">1 day ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/40 transition-colors">
            <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-white font-medium">New project added to portfolio</p>
              <p className="text-slate-400 text-sm mt-1">Portfolio updated with latest work</p>
              <p className="text-slate-500 text-xs mt-2">3 days ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;