import React from 'react';
import { Download, Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Resume = () => {
  const { isDark } = useTheme();
  const RESUME_URL = 'https://drive.google.com/file/d/1rjiPT51D3za2txXpvXrIUvmJT4T2U7jf/view?usp=sharing';

  const handleDownload = () => {
    window.open(RESUME_URL, '_blank', 'noopener,noreferrer');
  };

  const experience = [
    {
      title: 'Social Media Manager',
      company: 'LPU NSS',
      location: 'Block 13-DSW',
      period: 'August 2023 - April 2025',
      description: 'Lead development of LPU NSS Social Media Manager with a Volunteer.'
    }
    
  ];

  const education = [
    {
      degree: 'Masters in Computer Applications',
      school: 'Lovely Professionals University',
      location: 'Phagwara Punjab',
      period: '2025 - Present',
      description: 'Currently pursuing Masters in Computer Applications.'
    },
    {
      degree: 'Bachelor in Computer Applications',
      school: 'Lovely Professionals University',
      location: 'Phagwara Punjab',
      period: '2022 - 2025',
      description: 'Attain 7.29 CGPA in BCA.'
    },
    {
      degree: 'Intermediate',
      school: 'Dr Kiran saujiya Sr. Sec. Edu. Academy',
      location: 'Mainpuri, Uttar Pradesh',
      period: '2022',
      description: 'Attain 63% in Boards with CBSE Boarding Exam.'
    },
    {
      degree: 'High School',
      school: 'St. Thomas Sr. Sec. School Mainpuri',
      location: 'Mainpuri, Uttar Pradesh',
      period: '2018 - 2020',
      description: 'Attained 67% in Boards with CISCE Boarding Exam.'
    }
  ];

  return (
    <section id="resume" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Resume & <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto mb-8 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            A comprehensive overview of my professional journey and educational background
          </p>
          
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Full Resume
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Experience Section */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Professional Experience</h3>
            </div>

            <div className="space-y-8">
              {experience.map((job, index) => (
                <div key={index} className={`backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <h4 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.title}</h4>
                    <div className={`flex items-center text-sm mt-1 sm:mt-0 ${isDark ? 'text-blue-300' : 'text-blue-400'}`}>
                      <Calendar className="w-4 h-4 mr-1" />
                      {job.period}
                    </div>
                  </div>
                  
                  <div className={`flex items-center mb-3 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    <span className="font-medium">{job.company}</span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                  </div>
                  
                  <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{job.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Education</h3>
            </div>

            <div className="space-y-8">
              {education.map((edu, index) => (
                <div key={index} className={`backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <h4 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{edu.degree}</h4>
                    <div className={`flex items-center text-sm mt-1 sm:mt-0 ${isDark ? 'text-green-300' : 'text-green-400'}`}>
                      <Calendar className="w-4 h-4 mr-1" />
                      {edu.period}
                    </div>
                  </div>
                  
                  <div className={`flex items-center mb-3 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    <span className="font-medium">{edu.school}</span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {edu.location}
                    </div>
                  </div>
                  
                  <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{edu.description}</p>
                </div>
              ))}
            </div>

            {/* Resume Summary Card */}
            <div className={`mt-8 rounded-xl p-6 border ${
              isDark
                ? 'bg-gradient-to-r from-slate-700 to-slate-800 border-slate-600'
                : 'bg-gradient-to-r from-blue-100 to-purple-100 border-gray-300'
            }`}>
              <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Professional Summary</h4>
              <p className={`leading-relaxed text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Experienced Full Stack Developer with 5+ years in web development, 
                specializing in React, Node.js, and cloud technologies. Proven track record 
                of delivering scalable solutions and leading development teams. Strong background 
                in both technical implementation and user experience design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;