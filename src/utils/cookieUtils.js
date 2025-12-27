/**
 * Cookie utility functions for managing notification preferences
 */

export class CookieManager {
  // Set a cookie with expiration
  static setCookie(name, value, days = 30) {
    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      
      const cookieValue = typeof value === 'object' ? JSON.stringify(value) : value;
      document.cookie = `${name}=${encodeURIComponent(cookieValue)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
      
      return true;
    } catch (error) {
      console.warn('Failed to set cookie:', error);
      return false;
    }
  }

  // Get a cookie value
  static getCookie(name) {
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
          
          // Try to parse as JSON, fallback to string
          try {
            return JSON.parse(value);
          } catch {
            return value;
          }
        }
      }
      return null;
    } catch (error) {
      console.warn('Failed to get cookie:', error);
      return null;
    }
  }

  // Delete a cookie
  static deleteCookie(name) {
    try {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
      return true;
    } catch (error) {
      console.warn('Failed to delete cookie:', error);
      return false;
    }
  }

  // Check if cookies are enabled
  static areCookiesEnabled() {
    try {
      const testCookie = 'test_cookie_' + Date.now();
      this.setCookie(testCookie, 'test', 1);
      const isEnabled = this.getCookie(testCookie) === 'test';
      this.deleteCookie(testCookie);
      return isEnabled;
    } catch (error) {
      return false;
    }
  }

  // Get all cookies as an object
  static getAllCookies() {
    try {
      const cookies = {};
      const ca = document.cookie.split(';');
      
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        
        const eqPos = c.indexOf('=');
        if (eqPos > 0) {
          const name = c.substring(0, eqPos);
          const value = decodeURIComponent(c.substring(eqPos + 1));
          
          try {
            cookies[name] = JSON.parse(value);
          } catch {
            cookies[name] = value;
          }
        }
      }
      
      return cookies;
    } catch (error) {
      console.warn('Failed to get all cookies:', error);
      return {};
    }
  }
}

// Cookie names for notification system
export const COOKIE_NAMES = {
  NOTIFICATION_PREFERENCES: 'blog_notification_prefs',
  NOTIFICATION_PERMISSION_ASKED: 'notification_permission_asked',
  LAST_BLOG_CHECK: 'last_blog_check',
  USER_ID: 'notification_user_id',
  NOTIFICATION_HISTORY: 'notification_history'
};

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFS = {
  enabled: false,
  browserNotifications: true,
  toastNotifications: true,
  emailNotifications: false,
  categories: ['all'],
  frequency: 'immediate', // immediate, daily, weekly
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  },
  lastAsked: null,
  askAgainAfter: 7 // days
};

export default CookieManager;