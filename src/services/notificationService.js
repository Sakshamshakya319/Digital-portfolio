import toast from 'react-hot-toast';

class NotificationService {
  constructor() {
    this.lastBlogCheck = null;
    this.isSubscribed = false;
    this.checkInterval = null;
    this.STORAGE_KEY = 'blog_notification_settings';
    this.LAST_CHECK_KEY = 'last_blog_check';
    
    // Load settings from localStorage
    this.loadSettings();
  }

  // Load notification settings from localStorage
  loadSettings() {
    try {
      const settings = localStorage.getItem(this.STORAGE_KEY);
      if (settings) {
        const parsed = JSON.parse(settings);
        this.isSubscribed = parsed.isSubscribed || false;
      }
      
      const lastCheck = localStorage.getItem(this.LAST_CHECK_KEY);
      if (lastCheck) {
        this.lastBlogCheck = new Date(lastCheck);
      }
    } catch (error) {
      console.warn('Failed to load notification settings:', error);
    }
  }

  // Save notification settings to localStorage
  saveSettings() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        isSubscribed: this.isSubscribed
      }));
      
      if (this.lastBlogCheck) {
        localStorage.setItem(this.LAST_CHECK_KEY, this.lastBlogCheck.toISOString());
      }
    } catch (error) {
      console.warn('Failed to save notification settings:', error);
    }
  }

  // Request browser notification permission
  async requestPermission() {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      toast.error('Notifications are blocked. Please enable them in your browser settings.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
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
      return false;
    }
  }

  // Subscribe to blog notifications
  async subscribe() {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return false;

    this.isSubscribed = true;
    this.lastBlogCheck = new Date();
    this.saveSettings();
    
    // Start checking for new blogs
    this.startChecking();
    
    toast.success('Successfully subscribed to blog notifications!');
    return true;
  }

  // Unsubscribe from blog notifications
  unsubscribe() {
    this.isSubscribed = false;
    this.stopChecking();
    this.saveSettings();
    
    toast.success('Unsubscribed from blog notifications');
  }

  // Start periodic checking for new blogs
  startChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Check every 5 minutes (300000 ms)
    this.checkInterval = setInterval(() => {
      this.checkForNewBlogs();
    }, 300000);

    // Don't check immediately to avoid interfering with initial page load
    // Wait 30 seconds before first check
    setTimeout(() => {
      this.checkForNewBlogs();
    }, 30000);
  }

  // Stop periodic checking
  stopChecking() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Check for new blogs
  async checkForNewBlogs() {
    if (!this.isSubscribed || !this.lastBlogCheck) return;

    try {
      // Import blogAPI dynamically to avoid circular dependencies
      const { blogAPI } = await import('./api.js');
      
      const response = await blogAPI.getAll({
        page: 1,
        limit: 5, // Reduced limit for notification checking
        sortBy: 'publishedAt',
        sortOrder: 'desc'
      });

      const blogs = response.data.blogs || [];
      const newBlogs = blogs.filter(blog => {
        const publishedDate = new Date(blog.publishedAt);
        return publishedDate > this.lastBlogCheck;
      });

      if (newBlogs.length > 0) {
        this.showNewBlogNotifications(newBlogs);
        this.lastBlogCheck = new Date();
        this.saveSettings();
      }
    } catch (error) {
      console.warn('Error checking for new blogs (notification service):', error);
      // Don't show error to user for background checks
    }
  }

  // Show notifications for new blogs
  showNewBlogNotifications(newBlogs) {
    newBlogs.forEach((blog, index) => {
      // Show browser notification
      this.showBrowserNotification(blog);
      
      // Show toast notification with delay to avoid spam
      setTimeout(() => {
        this.showToastNotification(blog);
      }, index * 1000);
    });
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
        silent: false
      });

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

      // Handle click to navigate to blog
      notification.onclick = () => {
        window.focus();
        window.open(`/blog/${blog.slug}`, '_blank');
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
      isSupported: 'Notification' in window
    };
  }

  // Initialize the service (call this when the app starts)
  initialize() {
    if (this.isSubscribed) {
      this.startChecking();
    }
  }

  // Cleanup (call this when the app unmounts)
  cleanup() {
    this.stopChecking();
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService;