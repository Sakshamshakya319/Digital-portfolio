import React from 'react';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
  const { isDark } = useTheme();

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Profile Image */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-300">
              <img
                src="../profile.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>


        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Saksham Shakya
          </span>
        </h1>

        <h2 className={`text-xl md:text-3xl mb-6 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
          Full Stack Developer & UI/UX Designer
        </h2>

        <p className={`text-lg mb-8 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
          🚀 Turning ideas into seamless digital experiences. I craft clean code, elegant design,
           and user-first solutions that make products unforgettable.
        </p>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-12">
          <a
            href="https://github.com/Sakshamshakya319"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
              isDark
                ? 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/sakshamshakya/"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
              isDark
                ? 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="mailto:sakshamshakya94@gmail.com"
            className={`w-12 h-12 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
              isDark
                ? 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
                : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            onClick={scrollToAbout}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Learn More About Me
          </button>
          <button
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 border ${
              isDark
                ? 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600'
                : 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
            }`}
          >
            Get In Touch
          </button>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToAbout}
          className={`animate-bounce transition-colors duration-300 ${
            isDark ? 'text-slate-500 hover:text-slate-400' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <ChevronDown className="w-8 h-8 mx-auto" />
        </button>
      </div>
    </section>
  );
};

export default Hero;