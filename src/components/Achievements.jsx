import React from 'react';
import { Award, Trophy, Star, Users, Target, Zap } from 'lucide-react';

const Achievements = () => {
  const achievements = [
    {
      icon: Trophy,
      title: 'Best Web Developer Award 2023',
      organization: 'Tech Excellence Awards',
      date: '2023',
      description: 'Recognized for outstanding contribution to web development community and innovative project implementations.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Star,
      title: 'GitHub Top Contributor',
      organization: 'GitHub',
      date: '2022-2023',
      description: 'Achieved top 1% contributor status with 500+ contributions to open source projects and 50+ repositories.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Award,
      title: 'Certified AWS Solutions Architect',
      organization: 'Amazon Web Services',
      date: '2022',
      description: 'Professional certification demonstrating expertise in designing distributed systems on AWS platform.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Team Leadership Excellence',
      organization: 'TechCorp Solutions',
      date: '2023',
      description: 'Led a team of 8 developers to deliver 3 major projects ahead of schedule with 99.9% client satisfaction.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Target,
      title: 'Hackathon Winner - FinTech Innovation',
      organization: 'Silicon Valley Hackathon',
      date: '2022',
      description: 'First place winner for developing innovative blockchain-based payment solution in 48-hour competition.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Zap,
      title: 'Performance Optimization Expert',
      organization: 'Web Performance Community',
      date: '2021-2023',
      description: 'Improved application performance by average 75% across multiple projects, recognized as optimization expert.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const metrics = [
    {
      number: '50+',
      label: 'Projects Completed',
      description: 'Successfully delivered projects across various industries'
    },
    {
      number: '99.5%',
      label: 'Client Satisfaction',
      description: 'Consistently high client satisfaction ratings'
    },
    {
      number: '3M+',
      label: 'Code Lines Written',
      description: 'Lines of clean, maintainable code produced'
    },
    {
      number: '25+',
      label: 'Team Members Mentored',
      description: 'Junior developers guided and mentored'
    }
  ];

  return (
    <section id="achievements" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Achievements & <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Recognition</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Milestones and recognitions that mark my journey of continuous growth and professional excellence
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                      <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full mt-2 sm:mt-0">
                        {achievement.date}
                      </span>
                    </div>
                    
                    <p className="text-blue-400 font-medium mb-3">{achievement.organization}</p>
                    <p className="text-white/70 leading-relaxed">{achievement.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Metrics Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Career Highlights</h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {metric.number}
                </div>
                <div className="text-white/80 font-medium mb-2">
                  {metric.label}
                </div>
                <div className="text-white/60 text-sm leading-relaxed">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Awards */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2 text-yellow-400" />
              Professional Certifications
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/80">AWS Solutions Architect</span>
                <span className="text-white/60 text-sm">2022</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/80">Google Cloud Professional</span>
                <span className="text-white/60 text-sm">2021</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/80">React Advanced Certification</span>
                <span className="text-white/60 text-sm">2021</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/80">Scrum Master Certified</span>
                <span className="text-white/60 text-sm">2020</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-orange-400" />
              Awards & Recognition
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/80">Employee of the Year</span>
                <span className="text-white/60 text-sm">2023</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/80">Innovation Award</span>
                <span className="text-white/60 text-sm">2022</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/80">Best Team Leader</span>
                <span className="text-white/60 text-sm">2023</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/80">Community Contributor</span>
                <span className="text-white/60 text-sm">2021</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;