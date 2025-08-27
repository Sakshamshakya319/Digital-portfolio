import React from 'react';
import { MapPin, Calendar, Coffee, Heart } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Get to know more about my journey, passions, and what drives me as a developer
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image & Quick Stats */}
          <div className="space-y-8">
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1 mb-4">
                    <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-300">
                        <img
                          src="../profile.jpg"
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-white/60">Saksham Shakya</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-white/80 font-medium">Location</span>
                </div>
                <p className="text-white/60">Jalandhar, Punjab</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-purple-400 mr-2" />
                  <span className="text-white/80 font-medium">Experience</span>
                </div>
                <p className="text-white/60">5+ Years</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <Coffee className="w-5 h-5 text-orange-400 mr-2" />
                  <span className="text-white/80 font-medium">Coffee/Day</span>
                </div>
                <p className="text-white/60">4+ Cups</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center mb-2">
                  <Heart className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-white/80 font-medium">Passion</span>
                </div>
                <p className="text-white/60">Problem Solving, Innovator, Learner</p>
              </div>
            </div>
          </div>

          {/* Right Side - Bio Content */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">My Story</h3>
              <div className="space-y-4 text-white/70 leading-relaxed">
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
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">What Drives Me</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium">Innovation</h4>
                    <p className="text-white/60 text-sm">Always exploring cutting-edge solutions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium">Quality</h4>
                    <p className="text-white/60 text-sm">Commitment to clean, maintainable code</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium">Collaboration</h4>
                    <p className="text-white/60 text-sm">Building great things together</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium">Growth</h4>
                    <p className="text-white/60 text-sm">Continuous learning and improvement</p>
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