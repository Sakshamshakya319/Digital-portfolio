import React from 'react';
import { MapPin, Calendar, Coffee, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const { isDark } = useTheme();

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Me</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Get to know more about my journey, passions, and what drives me as a developer
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image & Quick Stats */}
          <div className="space-y-8 overflow-visible">
            <div className="relative flex flex-col items-center">
              <div className="w-64 h-80 mb-6 rounded-2xl overflow-hidden shadow-2xl border-2 bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                <div className="w-full h-full rounded-xl overflow-hidden bg-gray-900">
                  <img
                    src="../profile.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Saksham Shakya</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`backdrop-blur-sm rounded-xl p-4 border ${
                isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-gray-50 border-gray-300'
              }`}>
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 text-blue-400 mr-2" />
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Location</span>
                </div>
                <p className={isDark ? 'text-slate-300' : 'text-gray-700'}>Jalandhar, Punjab</p>
              </div>
              <div className={`backdrop-blur-sm rounded-xl p-4 border ${
                isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-gray-50 border-gray-300'
              }`}>
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-purple-400 mr-2" />
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Experience</span>
                </div>
                <p className={isDark ? 'text-slate-300' : 'text-gray-700'}>5+ Years</p>
              </div>
              
              <div className={`backdrop-blur-sm rounded-xl p-4 border ${
                isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-gray-50 border-gray-300'
              }`}>
                <div className="flex items-center mb-2">
                  <Heart className="w-5 h-5 text-red-400 mr-2" />
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Passion</span>
                </div>
                <p className={isDark ? 'text-slate-300' : 'text-gray-700'}>Problem Solving, Innovator, Learner</p>
              </div>
            </div>
          </div>

          {/* Right Side - Bio Content */}
          <div className="space-y-6">
            <div className={`backdrop-blur-sm rounded-2xl p-8 border ${
              isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-gray-50 border-gray-300'
            }`}>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>My Story</h3>
              <div className={`space-y-4 leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                <p>
                  Hello! I'm Saksham Shakya, a passionate full-stack developer with over 5 years of experience creating digital 
                  solutions that make a real impact. My journey began with a curiosity about how websites work, which 
                  quickly grew into a deep love for crafting exceptional user experiences.
                </p>
                <p>
                  I specialize in modern web technologies, working extensively with React.js, 
                  JavaScript, Tailwind CSS, HTML, CSS, and cloud platforms. I’m also skilled in 
                  backend and database solutions with Node.js, MongoDB, SQL, and PHP, and I’ve built cross-platform 
                  apps using Angular, Ionic, and React Native. For testing and API workflows, I rely on Postman to ensure 
                  reliability and performance.
                </p>
                <p>
                 My approach combines technical expertise with creative problem-solving to build applications 
                 that are not only functional but also delightful to use.
                </p>
                <p>
                  Outside of coding, you’ll often find me exploring new technologies, contributing to open-source 
                  projects, or mentoring aspiring developers. I strongly believe in continuous learning and in sharing 
                  knowledge with the community to grow together.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className={`backdrop-blur-sm rounded-2xl p-8 border ${
              isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-gray-50 border-gray-300'
            }`}>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>What Drives Me</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Innovation</h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-700'}`}>Always exploring cutting-edge solutions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Quality</h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-700'}`}>Commitment to clean, maintainable code</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Collaboration</h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-700'}`}>Building great things together</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Growth</h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-700'}`}>Continuous learning and improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;