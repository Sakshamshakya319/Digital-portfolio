import React, { useState } from 'react';
import { Menu, X, Home, User, FileText, Code, Briefcase, Award, Heart, Mail, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navigation = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    // { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'extracurricular', label: 'Activities', icon: Heart },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      isDark 
        ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-700' 
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className={`ml-2 font-semibold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Portfolio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? isDark
                        ? 'bg-slate-700 text-white'
                        : 'bg-gray-200 text-gray-900'
                      : isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`ml-4 p-2 rounded-lg transition-all duration-300 ${
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
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle Button Mobile */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
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
              className={`p-2 ${isDark ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`md:hidden pb-4 ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                        ? isDark
                          ? 'bg-slate-700 text-white'
                          : 'bg-gray-200 text-gray-900'
                        : isDark
                          ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;