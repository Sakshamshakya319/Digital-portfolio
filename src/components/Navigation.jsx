import React, { useState } from 'react';
import { Menu, X, Home, User, FileText, Code, Briefcase, Mail, Sun, Moon, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navigation = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpenDesktop, setAboutOpenDesktop] = useState(false);
  const [aboutOpenMobile, setAboutOpenMobile] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] shadow-lg transition-all duration-300 ${
      isDark 
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-700' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-300 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className={`ml-3 font-bold text-xl transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Saksham Shakya
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeSection === 'home'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDark
                    ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setAboutOpenDesktop(true)}
              onMouseLeave={() => setAboutOpenDesktop(false)}
            >
              <button
                onClick={() => setAboutOpenDesktop((v) => !v)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === 'about' || activeSection === 'skills' || activeSection === 'projects'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark
                      ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                About Me
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              {aboutOpenDesktop && (
                <div className={`absolute mt-2 rounded-lg shadow-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} min-w-[180px]`}>
                  <Link
                    to="/#about"
                    className={`w-full text-left px-4 py-2 rounded-t-lg ${isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    About
                  </Link>
                  <Link
                    to="/#skills"
                    className={`w-full text-left px-4 py-2 ${isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Skills
                  </Link>
                  <Link
                    to="/#projects"
                    className={`w-full text-left px-4 py-2 rounded-b-lg ${isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Projects
                  </Link>
                </div>
              )}
            </div>

            <a
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeSection === 'blog'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDark
                    ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Blogs
            </a>

            <Link
              to="/#contact"
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeSection === 'contact'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDark
                    ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </Link>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`ml-4 p-3 rounded-lg transition-all duration-300 shadow-sm ${
                isDark
                  ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu and theme button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Theme Toggle Button Mobile */}
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-lg transition-all duration-300 shadow-sm ${
                isDark
                  ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-3 rounded-lg transition-all duration-300 shadow-sm ${
                isDark 
                  ? 'text-slate-200 hover:text-white hover:bg-slate-700' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`md:hidden pb-4 border-t transition-colors ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex flex-col space-y-2 pt-4">
              <Link
                to="/"
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === 'home'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark
                      ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                Home
              </Link>

              <div className={`rounded-lg ${isDark ? 'bg-slate-800' : 'bg-white'} border ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                <button
                  onClick={() => setAboutOpenMobile((v) => !v)}
                  className={`w-full flex items-center justify-between px-4 py-3 font-medium transition-all ${
                    isDark
                      ? 'text-slate-200 hover:text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    About Me
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${aboutOpenMobile ? 'rotate-180' : ''}`} />
                </button>
                {aboutOpenMobile && (
                  <div className="flex flex-col">
                    <Link
                      to="/#about"
                      className={`text-left px-4 py-3 ${isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      About
                    </Link>
                    <Link
                      to="/#skills"
                      className={`text-left px-4 py-3 ${isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Skills
                    </Link>
                    <Link
                      to="/#projects"
                      className={`text-left px-4 py-3 ${isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Projects
                    </Link>
                  </div>
                )}
              </div>

              <a
                href="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isDark
                    ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FileText className="w-5 h-5 mr-3" />
                Blogs
              </a>

              <Link
                to="/#contact"
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === 'contact'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark
                      ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Mail className="w-5 h-5 mr-3" />
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
