import toast from 'react-hot-toast';
import { CookieManager, COOKIE_NAMES, DEFAULT_NOTIFICATION_PREFS } from '../utils/cookieUtils.js';

class NotificationService {
  constructor() {
    this.lastBlogCheck = null;
    this.isSubscribed = false;
    this.checkInterval = null;
    this.websocket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.userId = null;
    
    // Cookie-based storage keys
    this.STORAGE_KEY = 'blog_notification_settings';
    this.LAST_CHECK_KEY = 'last_blog_check';
    
    // Initialize user ID for tracking
    this.initializeUserId();
    
    // Load settings from cookies (fallback to localStorage)
    this.loadSettings();
    
    // Initialize real-time connection
    this.initializeRealTimeConnection();
  }

  // Initialize unique user ID for notification tracking
  initializeUserId() {
    let userId = CookieManager.getCookie(COOKIE_NAMES.USER_ID);
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      CookieManager.setCookie(COOKIE_NAMES.USER_ID, userId, 365); // 1 year
    }
    this.userId = userId;
  }

  // Load notification settings from cookies with localStorage fallback
  loadSettings() {
    try {
      // Try to load from cookies first
      let preferences = CookieManager.getCookie(COOKIE_NAMES.NOTIFICATION_PREFERENCES);
      
      // Fallback to localStorage if cookies not available
      if (!preferences) {
        const settings = localStorage.getItem(this.STORAGE_KEY);
        if (settings) {
          const parsed = JSON.parse(settings);
          preferences = {
            ...DEFAULT_NOTIFICATION_PREFS,
            enabled: parsed.isSubscribed || false
          };
          // Migrate to cookies
          this.saveSettings(preferences);
        } else {
          preferences = { ...DEFAULT_NOTIFICATION_PREFS };
        }
      }
      
      this.preferences = preferences;
      this.isSubscribed = preferences.enabled;
      
      // Load last check time
      const lastCheck = CookieManager.getCookie(COOKIE_NAMES.LAST_BLOG_CHECK) || 
                       localStorage.getItem(this.LAST_CHECK_KEY);
      if (lastCheck) {
        this.lastBlogCheck = new Date(lastCheck);
      }
    } catch (error) {
      console.warn('Failed to load notification settings:', error);
      this.preferences = { ...DEFAULT_NOTIFICATION_PREFS };
    }
  }

  // Save notification settings to cookies with localStorage backup
  saveSettings(preferences = null) {
    try {
      const prefs = preferences || this.preferences;
      
      // Save to cookies
      CookieManager.setCookie(COOKIE_NAMES.NOTIFICATION_PREFERENCES, prefs, 365);
      
      // Backup to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        isSubscribed: prefs.enabled
      }));
      
      if (this.lastBlogCheck) {
        CookieManager.setCookie(COOKIE_NAMES.LAST_BLOG_CHECK, this.lastBlogCheck.toISOString(), 365);
        localStorage.setItem(this.LAST_CHECK_KEY, this.lastBlogCheck.toISOString());
      }
      
      this.preferences = prefs;
    } catch (error) {
      console.warn('Failed to save notification settings:', error);
    }
  }

  // Check if we should ask for notification permission
  shouldAskForPermission() {
    const permissionAsked = CookieManager.getCookie(COOKIE_NAMES.NOTIFICATION_PERMISSION_ASKED);
    
    if (!permissionAsked) return true;
    
    const lastAsked = new Date(permissionAsked.date);
    const daysSinceAsked = (Date.now() - lastAsked.getTime()) / (1000 * 60 * 60 * 24);
    
    // Ask again after the specified number of days if permission was denied
    return permissionAsked.result === 'denied' && daysSinceAsked >= this.preferences.askAgainAfter;
  }

  // Record permission request result
  recordPermissionRequest(result) {
    CookieManager.setCookie(COOKIE_NAMES.NOTIFICATION_PERMISSION_ASKED, {
      date: new Date().toISOString(),
      result: result
    }, 365);
  }

  // Request browser notification permission with cookie tracking
  async requestPermission() {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications');
      this.recordPermissionRequest('not_supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.recordPermissionRequest('granted');
      return true;
    }

    if (Notification.permission === 'denied') {
      if (this.shouldAskForPermission()) {
        toast.error('Notifications are blocked. Please enable them in your browser settings.');
      }
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.recordPermissionRequest(permission);
      
      if (permission === 'granted') {
        toast.success('Notifications enabled! You\'ll be notified of new blog posts.');
        return true;
      } else {
        toast.error('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
      this.recordPermissionRequest('error');
      return false;
    }
  }

  // Initialize real-time WebSocket connection
  initializeRealTimeConnection() {
    if (typeof window === 'undefined') return;
    
    try {
      const wsUrl = this.getWebSocketUrl();
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onopen = () => {
        console.log('Real-time notification connection established');
        this.reconnectAttempts = 0;
        
        // Send user identification
        this.websocket.send(JSON.stringify({
          type: 'identify',
          userId: this.userId,
          preferences: this.preferences
        }));
      };
      
      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleRealTimeMessage(data);
        } catch (error) {
          console.warn('Failed to parse WebSocket message:', error);
        }
      };
      
      this.websocket.onclose = () => {
        console.log('Real-time notification connection closed');
        this.attemptReconnect();
      };
      
      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
    } catch (error) {
      console.warn('Failed to initialize real-time connection:', error);
      // Fallback to polling
      this.startPolling();
    }
  }

  // Get WebSocket URL based on environment
  getWebSocketUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    
    // In development, use the backend server port
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return `${protocol}//localhost:5000/ws/notifications`;
    }
    
    // In production, use the same host
    return `${protocol}//${host}/ws/notifications`;
  }

  // Handle real-time messages
  handleRealTimeMessage(data) {
    switch (data.type) {
      case 'new_blog':
        if (this.isSubscribed && this.shouldShowNotification(data.blog)) {
          this.showNewBlogNotifications([data.blog]);
          this.updateLastCheck();
        }
        break;
        
      case 'blog_updated':
        if (this.isSubscribed) {
          this.showBlogUpdateNotification(data.blog);
        }
        break;
        
      case 'ping':
        // Respond to keep-alive ping
        this.websocket.send(JSON.stringify({ type: 'pong' }));
        break;
        
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  // Check if notification should be shown based on preferences
  shouldShowNotification(blog) {
    const now = new Date();
    
    // Check quiet hours
    if (this.preferences.quietHours.enabled) {
      const currentTime = now.toTimeString().substr(0, 5);
      const { start, end } = this.preferences.quietHours;
      
      if (start > end) { // Overnight quiet hours
        if (currentTime >= start || currentTime <= end) {
          return false;
        }
      } else { // Same day quiet hours
        if (currentTime >= start && currentTime <= end) {
          return false;
        }
      }
    }
    
    // Check category preferences
    if (this.preferences.categories.length > 0 && 
        !this.preferences.categories.includes('all') &&
        !this.preferences.categories.includes(blog.category)) {
      return false;
    }
    
    return true;
  }

  // Attempt to reconnect WebSocket
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached, falling back to polling');
      this.startPolling();
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.initializeRealTimeConnection();
    }, delay);
  }

  // Start polling as fallback
  startPolling() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Check every 2 minutes when using polling
    this.checkInterval = setInterval(() => {
      this.checkForNewBlogs();
    }, 120000);

    // Initial check after 10 seconds
    setTimeout(() => {
      this.checkForNewBlogs();
    }, 10000);
  }

  // Subscribe to blog notifications
  async subscribe(preferences = {}) {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return false;

    const newPreferences = {
      ...this.preferences,
      ...preferences,
      enabled: true
    };

    this.isSubscribed = true;
    this.lastBlogCheck = new Date();
    this.saveSettings(newPreferences);
    
    // Start real-time or polling
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        type: 'subscribe',
        userId: this.userId,
        preferences: newPreferences
      }));
    } else {
      this.startPolling();
    }
    
    toast.success('Successfully subscribed to blog notifications!');
    return true;
  }

  // Unsubscribe from blog notifications
  unsubscribe() {
    const newPreferences = {
      ...this.preferences,
      enabled: false
    };

    this.isSubscribed = false;
    this.saveSettings(newPreferences);
    
    // Stop polling
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    // Notify WebSocket server
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        type: 'unsubscribe',
        userId: this.userId
      }));
    }
    
    toast.success('Unsubscribed from blog notifications');
  }

  // Update preferences
  updatePreferences(newPreferences) {
    const updatedPrefs = {
      ...this.preferences,
      ...newPreferences
    };
    
    this.saveSettings(updatedPrefs);
    
    // Notify WebSocket server
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        type: 'update_preferences',
        userId: this.userId,
        preferences: updatedPrefs
      }));
    }
  }

  // Update last check time
  updateLastCheck() {
    this.lastBlogCheck = new Date();
    this.saveSettings();
  }

  // Check for new blogs (fallback polling method)
  async checkForNewBlogs() {
    if (!this.isSubscribed || !this.lastBlogCheck) return;

    try {
      const { blogAPI } = await import('./api.js');
      
      const response = await blogAPI.getAll({
        page: 1,
        limit: 5,
        sortBy: 'publishedAt',
        sortOrder: 'desc'
      });

      const blogs = response.data.blogs || [];
      const newBlogs = blogs.filter(blog => {
        const publishedDate = new Date(blog.publishedAt);
        return publishedDate > this.lastBlogCheck && this.shouldShowNotification(blog);
      });

      if (newBlogs.length > 0) {
        this.showNewBlogNotifications(newBlogs);
        this.updateLastCheck();
      }
    } catch (error) {
      console.warn('Error checking for new blogs (notification service):', error);
    }
  }

  // Show notifications for new blogs
  showNewBlogNotifications(newBlogs) {
    newBlogs.forEach((blog, index) => {
      setTimeout(() => {
        if (this.preferences.browserNotifications) {
          this.showBrowserNotification(blog);
        }
        
        if (this.preferences.toastNotifications) {
          this.showToastNotification(blog);
        }
        
        this.recordNotificationHistory(blog);
      }, index * 1000);
    });
  }

  // Show blog update notification
  showBlogUpdateNotification(blog) {
    if (this.preferences.toastNotifications) {
      toast.info(`📝 Blog Updated: ${blog.title}`, {
        duration: 6000,
        position: 'top-right',
        style: {
          background: '#0f172a',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          cursor: 'pointer'
        },
        onClick: () => {
          window.open(`/blog/${blog.slug}`, '_blank');
        }
      });
    }
  }

  // Record notification in history
  recordNotificationHistory(blog) {
    try {
      let history = CookieManager.getCookie(COOKIE_NAMES.NOTIFICATION_HISTORY) || [];
      
      // Keep only last 50 notifications
      if (history.length >= 50) {
        history = history.slice(-49);
      }
      
      history.push({
        blogId: blog._id,
        title: blog.title,
        timestamp: new Date().toISOString(),
        read: false
      });
      
      CookieManager.setCookie(COOKIE_NAMES.NOTIFICATION_HISTORY, history, 30);
    } catch (error) {
      console.warn('Failed to record notification history:', error);
    }
  }

  // Get notification history
  getNotificationHistory() {
    return CookieManager.getCookie(COOKIE_NAMES.NOTIFICATION_HISTORY) || [];
  }

  // Mark notification as read
  markNotificationAsRead(blogId) {
    try {
      const history = this.getNotificationHistory();
      const updated = history.map(notification => 
        notification.blogId === blogId 
          ? { ...notification, read: true }
          : notification
      );
      
      CookieManager.setCookie(COOKIE_NAMES.NOTIFICATION_HISTORY, updated, 30);
    } catch (error) {
      console.warn('Failed to mark notification as read:', error);
    }
  }

  // Show browser notification
  showBrowserNotification(blog) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification('New Blog Post Published!', {
        body: `${blog.title}\n${blog.excerpt?.substring(0, 100)}...`,
        icon: blog.featuredImage || '/favicon.ico',
        badge: '/favicon.ico',
        tag: `blog-${blog._id}`,
        requireInteraction: false,
        silent: false,
        data: {
          blogId: blog._id,
          slug: blog.slug
        }
      });

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

      // Handle click to navigate to blog
      notification.onclick = () => {
        window.focus();
        window.open(`/blog/${blog.slug}`, '_blank');
        this.markNotificationAsRead(blog._id);
        notification.close();
      };
    } catch (error) {
      console.error('Error showing browser notification:', error);
    }
  }

  // Show toast notification
  showToastNotification(blog) {
    const toastId = toast.success(
      `📝 New Blog Post: ${blog.title}`,
      {
        duration: 8000,
        position: 'top-right',
        style: {
          background: '#1e293b',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          cursor: 'pointer'
        },
        onClick: () => {
          window.open(`/blog/${blog.slug}`, '_blank');
          this.markNotificationAsRead(blog._id);
          toast.dismiss(toastId);
        }
      }
    );
  }

  // Get subscription status
  getSubscriptionStatus() {
    return {
      isSubscribed: this.isSubscribed,
      hasPermission: 'Notification' in window && Notification.permission === 'granted',
      isSupported: 'Notification' in window,
      preferences: this.preferences,
      userId: this.userId,
      isRealTimeConnected: this.websocket && this.websocket.readyState === WebSocket.OPEN,
      cookiesEnabled: CookieManager.areCookiesEnabled()
    };
  }

  // Initialize the service
  initialize() {
    if (this.isSubscribed) {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        // Real-time connection will handle notifications
        return;
      } else {
        // Fallback to polling
        this.startPolling();
      }
    }
  }

  // Cleanup
  cleanup() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService;