import React from 'react';
import { Download, Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';

const Resume = () => {
  const RESUME_URL = 'https://drive.google.com/file/d/1JIuXVTi9n92KI5-aUgxuKr0mFqFIrYcU/view?usp=sharing';

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
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Resume & <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
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
              <h3 className="text-2xl font-bold text-white">Professional Experience</h3>
            </div>

            <div className="space-y-8">
              {experience.map((job, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <h4 className="text-xl font-semibold text-white">{job.title}</h4>
                    <div className="flex items-center text-blue-400 text-sm mt-1 sm:mt-0">
                      <Calendar className="w-4 h-4 mr-1" />
                      {job.period}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-white/70 mb-3">
                    <span className="font-medium">{job.company}</span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                  </div>
                  
                  <p className="text-white/60 leading-relaxed">{job.description}</p>
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
              <h3 className="text-2xl font-bold text-white">Education</h3>
            </div>

            <div className="space-y-8">
              {education.map((edu, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <h4 className="text-xl font-semibold text-white">{edu.degree}</h4>
                    <div className="flex items-center text-green-400 text-sm mt-1 sm:mt-0">
                      <Calendar className="w-4 h-4 mr-1" />
                      {edu.period}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-white/70 mb-3">
                    <span className="font-medium">{edu.school}</span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {edu.location}
                    </div>
                  </div>
                  
                  <p className="text-white/60 leading-relaxed">{edu.description}</p>
                </div>
              ))}
            </div>

            {/* Resume Summary Card */}
            <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-3">Professional Summary</h4>
              <p className="text-white/70 leading-relaxed text-sm">
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