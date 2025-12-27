import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Settings, Check, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import notificationService from '../services/notificationService';

const NotificationSettings = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [status, setStatus] = useState({
    isSubscribed: false,
    hasPermission: false,
    isSupported: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    updateStatus();
  }, []);

  const updateStatus = () => {
    setStatus(notificationService.getSubscriptionStatus());
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await notificationService.subscribe();
      updateStatus();
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = () => {
    setIsLoading(true);
    try {
      notificationService.unsubscribe();
      updateStatus();
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-md rounded-2xl shadow-2xl ${
          isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Blog Notifications
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Browser Support Check */}
          {!status.isSupported && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <BellOff className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  Your browser doesn't support notifications
                </p>
              </div>
            </div>
          )}

          {/* Current Status */}
          <div className="space-y-3">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Current Status
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Browser Support
                </span>
                <div className="flex items-center space-x-2">
                  {status.isSupported ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    status.isSupported 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {status.isSupported ? 'Supported' : 'Not Supported'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Permission
                </span>
                <div className="flex items-center space-x-2">
                  {status.hasPermission ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    status.hasPermission 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {status.hasPermission ? 'Granted' : 'Not Granted'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Subscription
                </span>
                <div className="flex items-center space-x-2">
                  {status.isSubscribed ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    status.isSubscribed 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {status.isSubscribed ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Get notified when new blog posts are published. Notifications will appear as:
            </p>
            <ul className={`text-sm space-y-1 ml-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <li>• Browser notifications (if permission granted)</li>
              <li>• In-app toast notifications</li>
              <li>• Automatic checks every 5 minutes</li>
            </ul>
          </div>

          {/* Action Buttons */}
          {status.isSupported && (
            <div className="space-y-3">
              <div className="flex space-x-3">
                {!status.isSubscribed ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                    <span>{isLoading ? 'Subscribing...' : 'Subscribe'}</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUnsubscribe}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <BellOff className="w-4 h-4" />
                    )}
                    <span>{isLoading ? 'Unsubscribing...' : 'Unsubscribe'}</span>
                  </motion.button>
                )}
              </div>
              
              {/* Test Notification Button */}
              {status.isSubscribed && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Test notification
                    const testBlog = {
                      _id: 'test-id',
                      title: 'Test Blog Post',
                      excerpt: 'This is a test notification to verify that your notifications are working correctly.',
                      slug: 'test-blog-post',
                      featuredImage: null
                    };
                    notificationService.showNewBlogNotifications([testBlog]);
                  }}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isDark
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>🧪</span>
                  <span>Test Notification</span>
                </motion.button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationSettings;