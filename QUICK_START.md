# Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Admin User
```bash
npm run init-admin
```

### 3. Start Development Servers

**Option A: Use the batch file (Windows)**
```bash
start.bat
```

**Option B: Manual start**
```bash
# Terminal 1 - Backend Server
npm run server

# Terminal 2 - Frontend Client  
npm run client
```

### 4. Access Your Portfolio

- **Portfolio Website**: http://localhost:5173
- **Blog**: http://localhost:5173/blog
- **Admin Panel**: http://localhost:5173/admin/login

### 5. Admin Login Credentials

- **Username**: `sakshamshakya94`
- **Password**: `nrt*gam1apt0AZX-gdx`

## 📝 Admin Panel Features

### Blog Management
- Create and edit blog posts with rich text editor
- Publish/unpublish posts
- Add categories, tags, and featured images
- Track views and likes

### Project Management
- Add portfolio projects
- Set project status and categories
- Add live demo and GitHub links
- Upload project images

### Contact Management
- View contact form submissions
- Update message status
- Reply to messages

### Education & Skills
- Manage educational background
- Add and organize skills
- Set proficiency levels

## 🛠️ Troubleshooting

### Port Already in Use
If you get "EADDRINUSE" error:
```bash
# Kill processes on port 5000
npx kill-port 5000

# Kill processes on port 5173
npx kill-port 5173
```

### Database Connection Issues
- Ensure MongoDB Atlas connection string is correct in `.env`
- Check network connectivity
- Verify database credentials

### CSS Import Errors
- Ensure all `@import` statements are at the top of CSS files
- Clear browser cache and restart dev server

## 📱 Features

✅ Modern animations with Framer Motion  
✅ Rich text blog editor  
✅ Social media sharing  
✅ Blog likes system  
✅ Responsive design  
✅ Dark/Light theme  
✅ Admin authentication  
✅ MongoDB integration  
✅ Contact form  
✅ Project showcase  

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-jwt-secret
MONGODB_URI=your-mongodb-connection-string
```

### API Proxy
The frontend uses Vite proxy to route `/api` requests to the backend server, eliminating CORS issues.

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure both servers are running
3. Verify database connection
4. Clear browser cache
5. Restart development servers