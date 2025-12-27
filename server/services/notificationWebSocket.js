import { WebSocketServer } from 'ws';
import { authenticateToken } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

class NotificationWebSocketService {
  constructor() {
    this.clients = new Map(); // userId -> WebSocket connection
    this.wss = null;
  }

  // Initialize WebSocket server
  initialize(server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws/notifications',
      verifyClient: (info) => {
        // Allow all connections for now, we'll authenticate after connection
        return true;
      }
    });

    this.wss.on('connection', (ws, request) => {
      console.log('New WebSocket connection established');
      
      ws.isAlive = true;
      ws.userId = null;
      ws.preferences = null;

      // Handle incoming messages
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          ws.send(JSON.stringify({ 
            type: 'error', 
            message: 'Invalid message format' 
          }));
        }
      });

      // Handle connection close
      ws.on('close', () => {
        if (ws.userId) {
          console.log(`WebSocket connection closed for user: ${ws.userId}`);
          this.clients.delete(ws.userId);
        }
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      // Pong handler for keep-alive
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'WebSocket connection established'
      }));
    });

    // Set up keep-alive ping
    this.setupKeepAlive();

    console.log('WebSocket server initialized for notifications');
  }

  // Handle incoming messages from clients
  handleMessage(ws, message) {
    switch (message.type) {
      case 'identify':
        this.handleIdentify(ws, message);
        break;
        
      case 'subscribe':
        this.handleSubscribe(ws, message);
        break;
        
      case 'unsubscribe':
        this.handleUnsubscribe(ws, message);
        break;
        
      case 'update_preferences':
        this.handleUpdatePreferences(ws, message);
        break;
        
      case 'pong':
        // Keep-alive response
        ws.isAlive = true;
        break;
        
      default:
        ws.send(JSON.stringify({
          type: 'error',
          message: `Unknown message type: ${message.type}`
        }));
    }
  }

  // Handle client identification
  handleIdentify(ws, message) {
    const { userId, preferences, token } = message;
    
    if (!userId) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'User ID is required'
      }));
      return;
    }

    // Optional: Verify JWT token for authenticated users
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ws.isAuthenticated = true;
        ws.authUserId = decoded.userId;
      } catch (error) {
        // Continue without authentication for anonymous users
        ws.isAuthenticated = false;
      }
    }

    ws.userId = userId;
    ws.preferences = preferences || {};
    
    // Store client connection
    this.clients.set(userId, ws);
    
    console.log(`User identified: ${userId} (authenticated: ${ws.isAuthenticated || false})`);
    
    ws.send(JSON.stringify({
      type: 'identified',
      userId: userId,
      authenticated: ws.isAuthenticated || false
    }));
  }

  // Handle subscription
  handleSubscribe(ws, message) {
    const { userId, preferences } = message;
    
    if (!ws.userId || ws.userId !== userId) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'User not identified or ID mismatch'
      }));
      return;
    }

    ws.preferences = { ...ws.preferences, ...preferences, enabled: true };
    
    console.log(`User ${userId} subscribed to notifications`);
    
    ws.send(JSON.stringify({
      type: 'subscribed',
      message: 'Successfully subscribed to notifications'
    }));
  }

  // Handle unsubscription
  handleUnsubscribe(ws, message) {
    const { userId } = message;
    
    if (!ws.userId || ws.userId !== userId) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'User not identified or ID mismatch'
      }));
      return;
    }

    ws.preferences = { ...ws.preferences, enabled: false };
    
    console.log(`User ${userId} unsubscribed from notifications`);
    
    ws.send(JSON.stringify({
      type: 'unsubscribed',
      message: 'Successfully unsubscribed from notifications'
    }));
  }

  // Handle preference updates
  handleUpdatePreferences(ws, message) {
    const { userId, preferences } = message;
    
    if (!ws.userId || ws.userId !== userId) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'User not identified or ID mismatch'
      }));
      return;
    }

    ws.preferences = { ...ws.preferences, ...preferences };
    
    console.log(`User ${userId} updated notification preferences`);
    
    ws.send(JSON.stringify({
      type: 'preferences_updated',
      preferences: ws.preferences
    }));
  }

  // Broadcast new blog notification to all subscribed clients
  broadcastNewBlog(blog) {
    const message = {
      type: 'new_blog',
      blog: {
        _id: blog._id,
        title: blog.title,
        excerpt: blog.excerpt,
        slug: blog.slug,
        category: blog.category,
        featuredImage: blog.featuredImage,
        publishedAt: blog.publishedAt,
        tags: blog.tags
      },
      timestamp: new Date().toISOString()
    };

    let sentCount = 0;
    
    this.clients.forEach((ws, userId) => {
      if (ws.readyState === ws.OPEN && 
          ws.preferences && 
          ws.preferences.enabled && 
          this.shouldSendNotification(ws.preferences, blog)) {
        
        try {
          ws.send(JSON.stringify(message));
          sentCount++;
        } catch (error) {
          console.error(`Error sending notification to user ${userId}:`, error);
          // Remove dead connection
          this.clients.delete(userId);
        }
      }
    });

    console.log(`New blog notification sent to ${sentCount} clients: ${blog.title}`);
    return sentCount;
  }

  // Broadcast blog update notification
  broadcastBlogUpdate(blog) {
    const message = {
      type: 'blog_updated',
      blog: {
        _id: blog._id,
        title: blog.title,
        excerpt: blog.excerpt,
        slug: blog.slug,
        category: blog.category,
        featuredImage: blog.featuredImage,
        updatedAt: blog.updatedAt
      },
      timestamp: new Date().toISOString()
    };

    let sentCount = 0;
    
    this.clients.forEach((ws, userId) => {
      if (ws.readyState === ws.OPEN && 
          ws.preferences && 
          ws.preferences.enabled) {
        
        try {
          ws.send(JSON.stringify(message));
          sentCount++;
        } catch (error) {
          console.error(`Error sending blog update to user ${userId}:`, error);
          this.clients.delete(userId);
        }
      }
    });

    console.log(`Blog update notification sent to ${sentCount} clients: ${blog.title}`);
    return sentCount;
  }

  // Check if notification should be sent based on user preferences
  shouldSendNotification(preferences, blog) {
    // Check if notifications are enabled
    if (!preferences.enabled) return false;

    // Check category preferences
    if (preferences.categories && 
        preferences.categories.length > 0 && 
        !preferences.categories.includes('all') &&
        !preferences.categories.includes(blog.category)) {
      return false;
    }

    // Check quiet hours (basic implementation - could be enhanced with timezone support)
    if (preferences.quietHours && preferences.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.toTimeString().substr(0, 5);
      const { start, end } = preferences.quietHours;
      
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

    return true;
  }

  // Send notification to specific user
  sendNotificationToUser(userId, notification) {
    const ws = this.clients.get(userId);
    
    if (ws && ws.readyState === ws.OPEN) {
      try {
        ws.send(JSON.stringify(notification));
        return true;
      } catch (error) {
        console.error(`Error sending notification to user ${userId}:`, error);
        this.clients.delete(userId);
        return false;
      }
    }
    
    return false;
  }

  // Set up keep-alive ping
  setupKeepAlive() {
    setInterval(() => {
      this.clients.forEach((ws, userId) => {
        if (!ws.isAlive) {
          console.log(`Terminating dead connection for user: ${userId}`);
          ws.terminate();
          this.clients.delete(userId);
          return;
        }
        
        ws.isAlive = false;
        try {
          ws.ping();
        } catch (error) {
          console.error(`Error pinging user ${userId}:`, error);
          this.clients.delete(userId);
        }
      });
    }, 30000); // Ping every 30 seconds
  }

  // Get connection statistics
  getStats() {
    const totalConnections = this.clients.size;
    const subscribedConnections = Array.from(this.clients.values())
      .filter(ws => ws.preferences && ws.preferences.enabled).length;
    
    return {
      totalConnections,
      subscribedConnections,
      activeConnections: Array.from(this.clients.values())
        .filter(ws => ws.readyState === ws.OPEN).length
    };
  }

  // Cleanup
  cleanup() {
    if (this.wss) {
      this.wss.close();
    }
    this.clients.clear();
  }
}

// Create singleton instance
const notificationWebSocketService = new NotificationWebSocketService();

export default notificationWebSocketService;