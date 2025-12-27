import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Home, User, FileText, Code, Briefcase, Mail, Sun, Moon, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navigation = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpenDesktop, setAboutOpenDesktop] = useState(false);
  const [aboutOpenMobile, setAboutOpenMobile] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Refs and timeouts for dropdown delay management
  const dropdownTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId) => {
    if (isHomePage) {
      // If on homepage, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on other pages, navigate to homepage with hash
      navigate(`/#${sectionId}`);
    }
    setIsOpen(false);
  };

  // Handle dropdown open with immediate effect
  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setAboutOpenDesktop(true);
  };

  // Handle dropdown close with delay
  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setAboutOpenDesktop(false);
    }, 300); // 300ms delay before closing
  };

  // Handle dropdown item click with scroll
  const handleDropdownItemClick = (sectionId) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setAboutOpenDesktop(false);
    scrollToSection(sectionId);
  };

  // Handle navigation click with scroll
  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setAboutOpenDesktop(false);
      }
    };

    if (aboutOpenDesktop) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [aboutOpenDesktop]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] shadow-lg transition-all duration-300 ${
      isDark 
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-700' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-300 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className={`ml-3 font-bold text-xl transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Saksham Shakya
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => handleNavClick('home')}
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
            </button>

            <div
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                ref={buttonRef}
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
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                  aboutOpenDesktop ? 'rotate-180' : ''
                }`} />
              </button>
              {aboutOpenDesktop && (
                <div 
                  ref={dropdownRef}
                  className={`absolute top-full left-0 mt-2 rounded-lg shadow-lg border z-50 animate-dropdown ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
                  } min-w-[180px]`}
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="py-1">
                    <button
                      onClick={() => handleDropdownItemClick('about')}
                      className={`w-full text-left block px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                        isDark 
                          ? 'text-slate-200 hover:bg-slate-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      } first:rounded-t-lg`}
                    >
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-3" />
                        About
                      </div>
                    </button>
                    <button
                      onClick={() => handleDropdownItemClick('skills')}
                      className={`w-full text-left block px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                        isDark 
                          ? 'text-slate-200 hover:bg-slate-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <Code className="w-4 h-4 mr-3" />
                        Skills
                      </div>
                    </button>
                    <button
                      onClick={() => handleDropdownItemClick('projects')}
                      className={`w-full text-left block px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                        isDark 
                          ? 'text-slate-200 hover:bg-slate-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      } last:rounded-b-lg`}
                    >
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-3" />
                        Projects
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/blog"
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                location.pathname === '/blog'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDark
                    ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Blogs
            </Link>

            <button
              onClick={() => handleNavClick('contact')}
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
            </button>
            
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
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`pb-4 border-t transition-colors ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex flex-col space-y-2 pt-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  scrollToSection('home');
                }}
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === 'home'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark
                      ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                Home
              </button>

              <div className={`rounded-lg transition-all duration-300 ${
                isDark ? 'bg-slate-800' : 'bg-white'
              } border ${
                isDark ? 'border-slate-700' : 'border-gray-200'
              } ${aboutOpenMobile ? 'shadow-lg' : 'shadow-sm'}`}>
                <button
                  onClick={() => setAboutOpenMobile((v) => !v)}
                  className={`w-full flex items-center justify-between px-4 py-3 font-medium transition-all duration-200 rounded-lg ${
                    isDark
                      ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    About Me
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                    aboutOpenMobile ? 'rotate-180' : ''
                  }`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  aboutOpenMobile ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="border-t border-slate-200 dark:border-slate-600">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setAboutOpenMobile(false);
                        scrollToSection('about');
                      }}
                      className={`w-full text-left flex items-center px-4 py-3 text-sm transition-colors duration-200 ${
                        isDark 
                          ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <User className="w-4 h-4 mr-3" />
                      About
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setAboutOpenMobile(false);
                        scrollToSection('skills');
                      }}
                      className={`w-full text-left flex items-center px-4 py-3 text-sm transition-colors duration-200 ${
                        isDark 
                          ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Code className="w-4 h-4 mr-3" />
                      Skills
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setAboutOpenMobile(false);
                        scrollToSection('projects');
                      }}
                      className={`w-full text-left flex items-center px-4 py-3 text-sm transition-colors duration-200 rounded-b-lg ${
                        isDark 
                          ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 mr-3" />
                      Projects
                    </button>
                  </div>
                </div>
              </div>

              <Link
                to="/blog"
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  location.pathname === '/blog'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark
                      ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FileText className="w-5 h-5 mr-3" />
                Blogs
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false);
                  scrollToSection('contact');
                }}
                className={`w-full text-left flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === 'contact'
                    ? 'bg-blue-600 text-white shadow-md'
                    : isDark
                      ? 'text-slate-200 hover:text-white hover:bg-slate-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Mail className="w-5 h-5 mr-3" />
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;