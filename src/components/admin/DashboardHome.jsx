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
import { useTheme } from '../../context/ThemeContext';
import { blogAPI, projectAPI, contactAPI, skillAPI } from '../../services/api';

const DashboardHome = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    contacts: 0,
    skills: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
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

  const fetchRecentActivity = async () => {
    try {
      const [blogsRes, projectsRes, contactsRes] = await Promise.all([
        blogAPI.getAllAdmin().catch(() => ({ data: { blogs: [] } })),
        projectAPI.getAll().catch(() => ({ data: [] })),
        contactAPI.getAll().catch(() => ({ data: { contacts: [] } }))
      ]);

      const activities = [];

      // Add recent blogs
      const recentBlogs = (blogsRes.data.blogs || [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      
      recentBlogs.forEach(blog => {
        activities.push({
          id: `blog-${blog._id}`,
          type: 'blog',
          title: 'New blog post published',
          description: blog.title,
          date: new Date(blog.createdAt),
          color: 'bg-blue-500',
          icon: 'FileText'
        });
      });

      // Add recent projects
      const recentProjects = (projectsRes.data || [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2);
      
      recentProjects.forEach(project => {
        activities.push({
          id: `project-${project._id}`,
          type: 'project',
          title: 'New project added',
          description: project.title,
          date: new Date(project.createdAt),
          color: 'bg-purple-500',
          icon: 'FolderOpen'
        });
      });

      // Add recent contacts
      const recentContacts = (contactsRes.data.contacts || [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      
      recentContacts.forEach(contact => {
        activities.push({
          id: `contact-${contact._id}`,
          type: 'contact',
          title: 'New contact message received',
          description: `${contact.name}: ${contact.subject}`,
          date: new Date(contact.createdAt),
          color: 'bg-green-500',
          icon: 'Mail'
        });
      });

      // Sort all activities by date and take the most recent 6
      const sortedActivities = activities
        .sort((a, b) => b.date - a.date)
        .slice(0, 6);

      setRecentActivity(sortedActivities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (iconName) => {
    switch (iconName) {
      case 'FileText':
        return FileText;
      case 'FolderOpen':
        return FolderOpen;
      case 'Mail':
        return Mail;
      default:
        return MessageSquare;
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
        <h1 className={`text-3xl lg:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard Overview</h1>
        <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Welcome back! Here's what's happening with your portfolio.</p>
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
              className={`backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 cursor-pointer group ${
                isDark 
                  ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{card.title}</p>
                  <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-green-500 font-medium">{card.change}</span>
                <span className={`ml-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>from last month</span>
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
        className={`backdrop-blur-sm rounded-xl p-8 border ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white border-gray-200 shadow-sm'
        }`}
      >
        <h2 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.button 
            onClick={() => handleQuickAction('blog')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center space-x-4 p-6 rounded-xl transition-all duration-300 group ${
              isDark 
                ? 'bg-slate-700/50 hover:bg-slate-700' 
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
              isDark 
                ? 'bg-blue-500/20 group-hover:bg-blue-500/30' 
                : 'bg-blue-100 group-hover:bg-blue-200'
            }`}>
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-left">
              <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Create New Blog Post</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Write and publish articles</p>
            </div>
          </motion.button>
          
          <motion.button 
            onClick={() => handleQuickAction('project')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center space-x-4 p-6 rounded-xl transition-all duration-300 group ${
              isDark 
                ? 'bg-slate-700/50 hover:bg-slate-700' 
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
              isDark 
                ? 'bg-green-500/20 group-hover:bg-green-500/30' 
                : 'bg-green-100 group-hover:bg-green-200'
            }`}>
              <FolderOpen className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-left">
              <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Add New Project</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Showcase your work</p>
            </div>
          </motion.button>
          
          <motion.button 
            onClick={() => handleQuickAction('messages')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center space-x-4 p-6 rounded-xl transition-all duration-300 group ${
              isDark 
                ? 'bg-slate-700/50 hover:bg-slate-700' 
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
              isDark 
                ? 'bg-purple-500/20 group-hover:bg-purple-500/30' 
                : 'bg-purple-100 group-hover:bg-purple-200'
            }`}>
              <MessageSquare className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-left">
              <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>View Messages</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Check contact inquiries</p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`backdrop-blur-sm rounded-xl p-8 border ${
          isDark 
            ? 'bg-slate-800/50 border-slate-700/50' 
            : 'bg-white border-gray-200 shadow-sm'
        }`}
      >
        <h2 className={`text-2xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} />
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const IconComponent = getActivityIcon(activity.icon);
              return (
                <div 
                  key={activity.id}
                  className={`flex items-start space-x-4 p-4 rounded-xl transition-colors ${
                    isDark 
                      ? 'bg-slate-700/30 hover:bg-slate-700/40' 
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className={`w-3 h-3 ${activity.color} rounded-full mt-2 flex-shrink-0`}></div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{activity.title}</p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'} line-clamp-1`}>
                      {activity.description}
                    </p>
                    <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                      {getRelativeTime(activity.date)}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${
                    isDark ? 'bg-slate-600/30' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`w-4 h-4 ${
                      activity.type === 'blog' ? 'text-blue-500' :
                      activity.type === 'project' ? 'text-purple-500' :
                      'text-green-500'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardHome;