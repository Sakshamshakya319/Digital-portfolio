import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Settings, Check, X, Clock, Filter, Globe, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import notificationService from '../services/notificationService';

const NotificationSettings = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [status, setStatus] = useState({
    isSubscribed: false,
    hasPermission: false,
    isSupported: false,
    preferences: {},
    userId: null,
    isRealTimeConnected: false,
    cookiesEnabled: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [preferences, setPreferences] = useState({});

  useEffect(() => {
    if (isOpen) {
      updateStatus();
    }
  }, [isOpen]);

  const updateStatus = () => {
    const currentStatus = notificationService.getSubscriptionStatus();
    setStatus(currentStatus);
    setPreferences(currentStatus.preferences || {});
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await notificationService.subscribe(preferences);
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

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    if (status.isSubscribed) {
      notificationService.updatePreferences(newPreferences);
    }
  };

  const handleQuietHoursChange = (field, value) => {
    const newQuietHours = { ...preferences.quietHours, [field]: value };
    handlePreferenceChange('quietHours', newQuietHours);
  };

  const handleCategoryChange = (category, checked) => {
    let newCategories = [...(preferences.categories || ['all'])];
    
    if (category === 'all') {
      newCategories = checked ? ['all'] : [];
    } else {
      if (checked) {
        newCategories = newCategories.filter(c => c !== 'all');
        if (!newCategories.includes(category)) {
          newCategories.push(category);
        }
      } else {
        newCategories = newCategories.filter(c => c !== category);
      }
      
      if (newCategories.length === 0) {
        newCategories = ['all'];
      }
    }
    
    handlePreferenceChange('categories', newCategories);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', label: 'General', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  const categories = ['Technology', 'Web Development', 'Programming', 'Tutorial', 'Personal', 'Other'];

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
        className={`w-full max-w-2xl rounded-2xl shadow-2xl ${
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
              Notification Settings
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-300'
                    : 'text-slate-600 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-6">
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

              {/* Cookie Warning */}
              {!status.cookiesEnabled && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-yellow-500" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Cookies are disabled. Preferences will be stored locally only.
                    </p>
                  </div>
                </div>
              )}

              {/* Connection Status */}
              <div className="space-y-3">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Connection Status
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Real-time
                      </span>
                      <div className="flex items-center space-x-2">
                        {status.isRealTimeConnected ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-orange-500" />
                        )}
                        <span className={`text-sm ${
                          status.isRealTimeConnected 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-orange-600 dark:text-orange-400'
                        }`}>
                          {status.isRealTimeConnected ? 'Connected' : 'Polling'}
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
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Notification Types */}
              <div className="space-y-3">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Notification Types
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      Browser Notifications
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.browserNotifications !== false}
                      onChange={(e) => handlePreferenceChange('browserNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      In-App Toast Notifications
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.toastNotifications !== false}
                      onChange={(e) => handlePreferenceChange('toastNotifications', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Blog Categories
                </h3>
                
                <div className="space-y-2">
                  <label className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      All Categories
                    </span>
                    <input
                      type="checkbox"
                      checked={(preferences.categories || ['all']).includes('all')}
                      onChange={(e) => handleCategoryChange('all', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  
                  {categories.map((category) => (
                    <label key={category} className="flex items-center justify-between">
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {category}
                      </span>
                      <input
                        type="checkbox"
                        checked={(preferences.categories || []).includes(category)}
                        onChange={(e) => handleCategoryChange(category, e.target.checked)}
                        disabled={(preferences.categories || ['all']).includes('all')}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="space-y-3">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Quiet Hours
                </h3>
                
                <label className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Enable Quiet Hours
                  </span>
                  <input
                    type="checkbox"
                    checked={preferences.quietHours?.enabled || false}
                    onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
                
                {preferences.quietHours?.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={preferences.quietHours?.start || '22:00'}
                        onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        End Time
                      </label>
                      <input
                        type="time"
                        value={preferences.quietHours?.end || '08:00'}
                        onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          isDark
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              {/* User ID */}
              <div className="space-y-2">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  User Identification
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Your unique ID: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">{status.userId}</code>
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  This ID is used to manage your notification preferences and is stored locally.
                </p>
              </div>

              {/* Data Storage */}
              <div className="space-y-2">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Data Storage
                </h3>
                <div className={`text-sm space-y-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <p>• Preferences are stored in browser cookies (30 days)</p>
                  <p>• Fallback storage in localStorage if cookies are disabled</p>
                  <p>• No personal information is collected or stored</p>
                  <p>• Data is not shared with third parties</p>
                </div>
              </div>

              {/* Cookie Status */}
              <div className="space-y-2">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Cookie Status
                </h3>
                <div className="flex items-center space-x-2">
                  {status.cookiesEnabled ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${
                    status.cookiesEnabled 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {status.cookiesEnabled ? 'Cookies Enabled' : 'Cookies Disabled'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationSettings;