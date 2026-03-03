# Saksham Shakya - Portfolio

Modern portfolio website built with React, Vite, and Firebase.

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Anime.js
- **Backend**: Firebase Realtime Database, Vercel Serverless Functions
- **Auth**: JWT for admin authentication
- **Deployment**: Vercel

## 📦 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔥 Firebase Migration

This project has been migrated from MongoDB to Firebase Realtime Database.

**Key Benefits:**
- ✅ No connection issues
- ✅ Real-time capabilities
- ✅ Generous free tier
- ✅ Automatic scaling
- ✅ Built-in security rules

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed setup instructions.

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step deployment guide.

**Quick Deploy:**
```bash
vercel
```

## 🔐 Admin Panel

Access the admin panel at `/admin` to:
- Create and manage blog posts
- Add and manage projects
- View contact form submissions

Default credentials are set in `.env` file.

## 📁 Project Structure

```
├── api/                    # Serverless API functions
│   ├── firebase-admin.js   # Firebase Admin SDK setup
│   ├── blogs.js           # Blog CRUD operations
│   ├── projects.js        # Project CRUD operations
│   ├── contact.js         # Contact form handler
│   └── admin/             # Admin-only endpoints
├── src/
│   ├── components/        # React components
│   ├── firebase/          # Firebase client config
│   ├── styles/           # CSS files
│   └── App.jsx           # Main app component
├── .env                   # Environment variables
├── vercel.json           # Vercel configuration
└── vite.config.js        # Vite configuration
```

## 🔧 Environment Variables

Create a `.env` file:

```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
ADMIN_JWT_SECRET=your-jwt-secret

# Optional: For production with service account
# FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

## 🎨 Features

- ✨ Animated UI with Anime.js and Canvas API
- 📱 Fully responsive design
- 🌙 Dark/Light theme toggle
- 📝 Rich text editor for blog posts (Quill)
- 🔍 Project filtering by category
- 💬 Contact form with Firebase storage
- 🔐 Secure admin authentication
- ⚡ Fast performance with Vite

## 📊 Firebase Database Structure

```
sakshamshakya-14df5-default-rtdb/
├── blogs/          # Blog posts
├── projects/       # Portfolio projects
└── contacts/       # Contact form submissions
```

## 🛡️ Security

- Admin routes protected with JWT
- Firebase security rules configured
- Environment variables for sensitive data
- HttpOnly cookies for auth tokens

## 📝 License

Private project - All rights reserved

## 👤 Author

**Saksham Shakya**
- MCA Student at Lovely Professional University
- NSS Achiever | Parliament Visit
- Socio.io Publisher

---

Built with ❤️ using React and Firebase
