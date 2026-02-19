# Professional Portfolio - Saksham Shakya

A modern, full-stack portfolio website built with React, Node.js, Express, and MongoDB. Features a complete admin panel for managing content, blog posts, projects, and contact messages.

## 🚀 Features

### Frontend
- **Modern Design**: Clean, professional design with dark/light theme support
- **Smooth Animations**: Framer Motion animations throughout the site
- **Responsive**: Fully responsive design that works on all devices
- **Blog System**: Dynamic blog with categories, tags, and search functionality
- **Project Showcase**: Interactive project gallery with filtering
- **Contact Form**: Integrated contact form with real-time validation

### Backend & Admin Panel
- **Complete Admin Dashboard**: Manage all content from a single interface
- **Blog Management**: Create, edit, publish/unpublish blog posts
- **Project Management**: Add and manage portfolio projects
- **Contact Management**: View and respond to contact messages
- **Education Management**: Manage educational background
- **Skills Management**: Add and organize technical skills
- **User Authentication**: Secure admin authentication with JWT

### Technical Features
- **MongoDB Integration**: All data stored in MongoDB Atlas
- **RESTful API**: Clean API architecture with proper error handling
- **Modern Stack**: React 18, Node.js, Express, MongoDB
- **Type Safety**: TypeScript support for better development experience
- **Security**: Helmet, CORS, rate limiting, and input validation

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Framer Motion (animations)
- React Router DOM
- Axios (API calls)
- React Hook Form
- React Hot Toast
- Tailwind CSS
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- Helmet (security)
- CORS
- Express Rate Limit

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd professional-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
MONGODB_URI=mongodb+srv://saksham94:rvLJKfkxNYLLcgSw@portfolio.auxgecw.mongodb.net/?appName=portfolio
```

Create a `.env.local` file for the frontend:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Initialize Admin User
```bash
npm run init-admin
```

This will create an admin user with the following credentials:
- **Username**: sakshamshakya94
- **Password**: nrt*gam1apt0AZX-gdx

### 5. Start the Development Server
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 5173).

## 🎯 Usage

### Accessing the Portfolio
- **Main Portfolio**: http://localhost:5173
- **Blog**: http://localhost:5173/blog
- **Admin Panel**: http://localhost:5173/admin/login

### Admin Panel Features

#### Dashboard
- Overview of all content statistics
- Quick actions for common tasks
- Recent activity feed

#### Blog Management
- Create new blog posts with rich text editor
- Manage categories and tags
- Publish/unpublish posts
- View post analytics

#### Project Management
- Add new projects with images and descriptions
- Organize by categories
- Set project status (Completed, In Progress, Planned)
- Add live demo and GitHub links

#### Contact Management
- View all contact form submissions
- Update message status (New, Read, Replied, Archived)
- Quick reply via email integration

#### Education Management
- Add educational background
- Include achievements and descriptions
- Set date ranges and current status

#### Skills Management
- Add technical skills with proficiency levels
- Organize by categories
- Set visibility and display order

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/init-admin` - Initialize admin user

### Blog
- `GET /api/blogs` - Get published blogs (public)
- `GET /api/blogs/:slug` - Get single blog by slug (public)
- `GET /api/blogs/admin/all` - Get all blogs (admin)
- `POST /api/blogs` - Create blog (admin)
- `PUT /api/blogs/:id` - Update blog (admin)
- `DELETE /api/blogs/:id` - Delete blog (admin)

### Projects
- `GET /api/projects` - Get all projects (public)
- `GET /api/projects/:id` - Get single project (public)
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Contact
- `POST /api/contact` - Submit contact form (public)
- `GET /api/contact` - Get all contacts (admin)
- `PUT /api/contact/:id` - Update contact status (admin)
- `DELETE /api/contact/:id` - Delete contact (admin)

### Education
- `GET /api/education` - Get all education (public)
- `POST /api/education` - Create education (admin)
- `PUT /api/education/:id` - Update education (admin)
- `DELETE /api/education/:id` - Delete education (admin)

### Skills
- `GET /api/skills` - Get visible skills (public)
- `GET /api/skills/admin/all` - Get all skills (admin)
- `POST /api/skills` - Create skill (admin)
- `PUT /api/skills/:id` - Update skill (admin)
- `DELETE /api/skills/:id` - Delete skill (admin)

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables in your hosting platform

### Backend (Railway/Heroku)
1. Set up environment variables
2. Deploy the server code
3. Ensure MongoDB connection is working

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- Helmet for security headers

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Customization

### Themes
The portfolio supports both dark and light themes. Users can toggle between themes using the theme switcher in the navigation.

### Colors
Primary colors can be customized in the Tailwind CSS configuration:
- Blue: #3B82F6
- Purple: #8B5CF6
- Green: #10B981

### Content
All content is managed through the admin panel, making it easy to update:
- Personal information
- Skills and proficiency levels
- Projects and descriptions
- Blog posts and articles
- Contact information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Saksham Shakya**
- GitHub: [@sakshamshakya319](https://github.com/sakshamshakya319)
- LinkedIn: [sakshamshakya](https://linkedin.com/in/sakshamshakya)
- Email: saksham.shakya@lpu.in

## 🙏 Acknowledgments

- React team for the amazing framework
- Framer Motion for smooth animations
- Tailwind CSS for utility-first styling
- MongoDB for the database solution
- All the open-source contributors who made this project possible