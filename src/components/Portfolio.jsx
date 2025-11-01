import React, { useState } from 'react';
import { ExternalLink, Github, Filter, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Portfolio = () => {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Apps' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'ui', label: 'UI/UX Design' },
    { id: 'fullstack', label: 'Full Stack' }
  ];

  const projects = [
    {
      id: 1,
      title: 'Socio.io',
      category: 'fullstack',
      description: 'A Chrome extension that filters and moderates inappropriate content on the web.',
      longDescription: 'Socio.io Content Moderation Extension helps you browse the web safely by filtering and moderating harmful or inappropriate content in real time. It automatically detects offensive text and blurs sensitive images, giving you the choice to click and view if needed. With a simple toggle interface, you can enable or disable moderation anytime. The extension also lets you restore filtered content, track moderation history, and maintain full control over your browsing experience with ease and confidence.',
      image: 'https://i.ibb.co/93kJzvJN/Screenshot-2025-08-27-220945.png',
      technologies: ['React', 'Node.js', 'Railway', 'Razorpay', 'Google Cloud'],
      liveUrl: 'https://www.socio-io.tech/',
      githubUrl: 'https://github.com/Org-Socio/socio.io'
    },
    {
      id: 2,
      title: 'LPU NSS BLOG WEBSITE',
      category: 'web',
      description: 'Blog website for LPU NSS',
      longDescription: 'The LPU NSS (National Service Scheme) website is a dedicated platform for sharing updates, announcements, and activities of the NSS at Lovely Professional University. It serves as a blog and information hub where students can stay informed about upcoming events, social initiatives, and community service programs. The site aims to inspire youth participation, highlight impactful contributions, and provide easy access to resources that promote volunteerism, leadership, and meaningful societal change.',
      image: 'https://i.ibb.co/csWbS0f/Screenshot-2025-08-27-221410.png',
      technologies: ['HTML', 'SQL', 'PHP', 'Javascript', 'Bootstrap'],
      liveUrl: 'https://lpunss.in',
      githubUrl: 'https://github.com'
    },
    {
      id: 3,
      title: 'Weather Mobile App',
      category: 'web',
      description: 'Cross-platform weather app with beautiful UI',
      longDescription: 'Created a cross-platform mobile application using React Native that provides weather forecasts, interactive maps, weather alerts, location-based services, and offline capabilities. Features beautiful animations and intuitive user interface.',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
      technologies: ['React Native', 'OpenWeather API', 'AsyncStorage'],
      liveUrl: 'https://weather-website-sakshamshakya337.vercel.app/',
      githubUrl: 'https://github.com/sakshamshakya337/weather-website'
    },
    {
      id: 4,
      title: 'File Converter',
      category: 'web',
      description: 'To convert all files at one place',
      longDescription: 'The File Converter project is a simple and efficient tool designed to convert files from one format to another with ease. It supports multiple file types, ensuring users can quickly transform documents, images, audio, or video files into their desired formats. With a clean interface and fast processing, the converter eliminates compatibility issues and enhances productivity. Whether for personal, academic, or professional use, it provides a reliable, hassle-free solution for all file conversion needs.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTFBqPGDNTZ1ruK72-e_ddZwdfROkIiqXgoDU_Rvg29qMGWbuVTKY_7p5SatgqcbBEaXc',
      technologies: ['Javascript', 'websocket', 'User Research'],
      liveUrl: 'http://file-converter-gilt.vercel.app/',
      githubUrl: 'https://github.com/sakshamshakya337/File-converter'
    },
    {
      id: 5,
      title: 'Language Translator',
      category: 'fullstack',
      description: 'Full-featured Language Translator with All Languages',
      longDescription: 'The Language Translator project is a smart and user-friendly tool that allows users to instantly translate text across multiple languages. Designed with simplicity and accuracy in mind, it helps break communication barriers by providing quick and reliable translations for everyday conversations, academic needs, or professional use. With a clean interface and efficient processing, it supports seamless interaction, making it an ideal solution for students, travelers, and businesses looking to connect globally with ease.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXGdS-QZnRBYySucL6GvpYuiqalg-6zDUxIQ&s',
      technologies: [ 'Javascript', 'Express.js', 'API'],
      liveUrl: 'https://language-translator-two.vercel.app/',
      githubUrl: 'https://github.com/sakshamshakya337/Language-Translator'
    },
    {
      id: 6,
      title: 'Samarpan ',
      category: 'fullstack',
      description: 'real-time blood and platelet donor connection platform that brings donors and patients together to save lives.',
      longDescription: 'Samarpan is a comprehensive blood donation management platform designed to connect donors with patients in need of blood and platelets. Built with modern web technologies, it enables real-time connections, efficient donor management, and streamlined administrative operations.',
      image: 'https://i.ibb.co/mrDt2xgp/Screenshot-2025-11-01-095150.png',
      technologies: [ 'Next.Js', 'Express.js', 'API','MongoDb', 'Google OAuth'],
      liveUrl: 'https://samarpan-mu.vercel.app/',
      githubUrl: 'https://github.com/Sakshamshakya319/Samarpan'
    }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            My <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Portfolio</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            A collection of projects that showcase my skills and passion for creating exceptional digital experiences
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : isDark
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`group backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                  : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedProject(project)}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                <p className={`mb-4 line-clamp-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm rounded-full ${
                        isDark
                          ? 'bg-slate-700 text-slate-200'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      isDark
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-gray-200 text-gray-900'
                    }`}>
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className={`rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border ${
              isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-gray-300'
            }`}>
              {/* Modal Header */}
              <div className="relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <h3 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedProject.title}</h3>
                <p className={`mb-6 leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{selectedProject.longDescription}</p>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Technologies Used</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className={`px-4 py-2 border rounded-lg ${
                          isDark
                            ? 'bg-slate-700 text-slate-200 border-slate-600'
                            : 'bg-gradient-to-r from-blue-100 to-purple-100 text-gray-900 border-gray-300'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:scale-105 transition-all duration-300"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      View Live Project
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 border ${
                        isDark
                          ? 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600'
                          : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <Github className="w-5 h-5 mr-2" />
                      View Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;